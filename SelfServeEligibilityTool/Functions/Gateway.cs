using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AirCanada.ODE.CIP.APIClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using ODE.SSET.Core;
using ODE.SSET.Core.Domain;
using System.Linq;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace Functions
{
  public class Gateway
  {
    private readonly RuntimeContext _runtimeContext;
    private readonly OriginDestinationService _originDestinationService;
    private readonly ValidationService _validationService;
    private readonly AssessmentService _assessmentService;
    private readonly ISsetOperationsClient _ssetOperationsClient;

    public Gateway(
      RuntimeContext runtimeContext,
      ValidationService validationService,
      OriginDestinationService originDestinationService,
      AssessmentService assessmentService,
      ISsetOperationsClient ssetOperationsClient)
    {
      _runtimeContext = runtimeContext;
      _originDestinationService = originDestinationService;
      _validationService = validationService;
      _assessmentService = assessmentService;
      _ssetOperationsClient = ssetOperationsClient;
    }

    [FunctionName("Gateway")]
    public async Task<IActionResult> RunPublic(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "Gateway/{version}")] HttpRequest req, string version,
    ILogger log)
    {
      switch (version.ToLower())
      {
        case "v1":
          return await Run(req, log, true, false);
        case "v2":
          return await Run(req, log, true, true);
        default:
          return new NotFoundResult();
      }
    }

    [FunctionName("GatewayPrivate")]
    public async Task<IActionResult> RunPrivate(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "GatewayPrivate/{version}")] HttpRequest req, string version,
    ILogger log)
    {
      switch (version.ToLower())
      {
        case "v1":
          return await Run(req, log, false, false);
        case "v2":
          return await Run(req, log, false, true);
        default:
          return new NotFoundResult();
      }
    }

    private async Task<IActionResult> Run(HttpRequest req, ILogger log, bool isRecaptchaEnabled, bool dynamicsIntegration = false)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.");

        var options = new JsonSerializerOptions()
        {
          PropertyNameCaseInsensitive = true,
          
          Converters = { new JsonStringEnumConverter() },
        };

        var gatewayRequest = await JsonSerializer.DeserializeAsync<GatewayRequest>(req.Body, options);
        gatewayRequest.GatewayRequestContext.IsRecaptchaEnabled = isRecaptchaEnabled;

        var gatewayResponse = await _validationService.Run(gatewayRequest, dynamicsIntegration);

        log.LogInformation("Request Message Validation");
        foreach (var item in gatewayResponse.GatewayRequest.GatewayRequestContext?.ValidationExceptions)
        {
          log.LogInformation($"Validation Exception: Rule #{item.BusinessRuleCode}, property {item.PropertyName}.");
        }

        if (gatewayResponse.GatewayRequest.GatewayRequestContext.ValidationExceptions.Count == 0)
        {
          if (!dynamicsIntegration)
          {
            return await FlightDisruptionAssessment(gatewayRequest, gatewayResponse);
          }
          else
          {
            return await FlightDisruptionAssessmentByTicketNumber(gatewayRequest, gatewayResponse);
          }
        }
        else
        {
          if (!dynamicsIntegration)
          {
            log.LogInformation($"GatewayResponse {gatewayResponse}.");
            return new BadRequestObjectResult(gatewayResponse);
          }
          else
          {
            const int errorCode = 31;
            const string errorMsg = "validationError";

            ItineraryBaseModel itineraryBaseModel  = new ItineraryBaseModel();
            itineraryBaseModel.ErrorCode = errorCode;
            itineraryBaseModel.ErrorMessage = errorMsg;
            itineraryBaseModel.ValidationExceptions = gatewayResponse.GatewayRequest.GatewayRequestContext.ValidationExceptions;

            log.LogInformation($"GatewayResponse {gatewayResponse}.");
            return new BadRequestObjectResult(itineraryBaseModel);
          }
        }
      }
      catch (System.Exception exception)
      {
        log.LogInformation($"Error {exception.Message}.");
        return new BadRequestObjectResult(new GatewayResponse() { ExceptionMessage = exception.Message });
      }
    }

    private async Task<IActionResult> FlightDisruptionAssessment(GatewayRequest gatewayRequest, GatewayResponse gatewayResponse)
    {
      var operationType = gatewayRequest.OperationType;

      var ssetOperation = new SsetOperationModel
      {
        SessionId = gatewayRequest.SessionId,
        OperationType = operationType,
        Pnr = gatewayRequest.EligibilityRequest.PNR,
        TicketNumber = gatewayRequest.EligibilityRequest.TicketNumber,
        FlightDate = gatewayRequest.EligibilityRequest.FlightDate,
        FirstName = gatewayRequest.EligibilityRequest.FirstName,
        LastName = gatewayRequest.EligibilityRequest.LastName,
        IsSsetV2 = false,
      };

      if (operationType == SsetOperationType.Assessment)
      {
        gatewayResponse.PassengerProtectionResponse = await _originDestinationService.InspectAsync(gatewayResponse.GatewayRequest.EligibilityRequest);
        (gatewayResponse.EligibilityResponse, ssetOperation.AssessmentId) =
          await _assessmentService.RunAssessmentAsync(gatewayResponse.PassengerProtectionResponse);
      }

      await _ssetOperationsClient.NotifyAssessmentCaseCreationClickAsync(null, null, ssetOperation);

      return new OkObjectResult(gatewayResponse);
    }

    private async Task<IActionResult> FlightDisruptionAssessmentByTicketNumber(GatewayRequest gatewayRequest, GatewayResponse gatewayResponse)
    {
      var operationType = gatewayRequest.OperationType;
      ItineraryBaseModel itineraryBaseModelResponse = null;
      PassengerProtectionResponse passengerProtectionResponse;

      if (operationType == SsetOperationType.Assessment)
      {
        (itineraryBaseModelResponse, passengerProtectionResponse) = await _originDestinationService.InspectAsyncByTicketNumber(gatewayResponse.GatewayRequest.EligibilityRequest);
        if ((passengerProtectionResponse != null) && passengerProtectionResponse.PassengerOriginDestinationWeightings.Any())
        {
          itineraryBaseModelResponse = await _assessmentService.RunSelfAssessmentAsync(itineraryBaseModelResponse, passengerProtectionResponse);

          foreach (var itineraryOriginDestination in itineraryBaseModelResponse.OriginDestination)
          {
            var ssetOperation = new SsetOperationModel
            {
              SessionId = gatewayRequest.SessionId,
              OperationType = operationType,
              Pnr = itineraryBaseModelResponse.PNRNumber,
              TicketNumber = gatewayRequest.EligibilityRequest.TicketNumber,
              FlightDate = itineraryOriginDestination.Flights.FirstOrDefault().ScheduledDepartureDate,
              FirstName = itineraryBaseModelResponse.Passenger.FirstName,
              LastName = itineraryBaseModelResponse.Passenger.LastName,
              AssessmentId = itineraryOriginDestination.AssessmentId,
              IsSsetV2 = true,
            };
            await _ssetOperationsClient.NotifyAssessmentCaseCreationClickAsync(null, null, ssetOperation);
          }
        }
      }
      return new OkObjectResult(itineraryBaseModelResponse);
    }
  }
}
