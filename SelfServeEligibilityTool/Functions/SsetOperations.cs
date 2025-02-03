namespace ODE.SSET.Functions
{
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.Azure.WebJobs;
  using Microsoft.Azure.WebJobs.Extensions.Http;
  using Microsoft.Extensions.Logging;
  using ODE.SSET.Core.Domain;
  using ODE.SSET.Core.Domain.Dynamics;
  using ODE.SSET.Interfaces;
  using ODE.SSET.Interfaces.Dynamics;
  using ODE.SSET.Interfaces.Enums;
  using System.Linq;
  using System.Text.Json;
  using System.Text.Json.Serialization;
  using System.Threading;
  using System.Threading.Tasks;

  public class SsetOperations
  {
    private readonly RuntimeContext _runtimeContext;
    private readonly ISsetOperationsService _ssetOperationsService;

    public SsetOperations(RuntimeContext runtimeContext, 
      ISsetOperationsService ssetOperationsService)
    {
      _runtimeContext = runtimeContext;
      _ssetOperationsService = ssetOperationsService;
    }

    [FunctionName(nameof(GetLanguages))]
    public async Task<IActionResult> GetLanguages(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var result = await _ssetOperationsService.GetLanguagesAsync(cancellationToken);

        return new OkObjectResult(result);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName(nameof(GetAirports))]
    public async Task<IActionResult> GetAirports(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var languageCode = req.Query["languageCode"].FirstOrDefault();

        if (string.IsNullOrEmpty(languageCode))
        {
          return new BadRequestObjectResult("Language code is required!");
        }

        var languages = await _ssetOperationsService.GetLanguagesAsync(cancellationToken);

        if (languages != null && !languages.Any(l => l.Code.ToLower().Equals(languageCode.ToLower())))
        {
          return new BadRequestObjectResult(@$"Language code {languageCode} is invalid or not supported!");
        }

        var airportCodes = req.Query["airportCodes"].ToList();

        var result = await _ssetOperationsService.GetAirportsAsync(languageCode, airportCodes, cancellationToken);

        return new OkObjectResult(result);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName(nameof(GetProvinces))]
    public async Task<IActionResult> GetProvinces(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var languageCode = req.Query["languageCode"].FirstOrDefault();

        if (string.IsNullOrEmpty(languageCode))
        {
          return new BadRequestObjectResult("Language code is required!");
        }

        var countryCode = req.Query["countryCode"].FirstOrDefault();

        if (string.IsNullOrEmpty(countryCode))
        {
          return new BadRequestObjectResult("Country code is required!");
        }

        var languages = await _ssetOperationsService.GetLanguagesAsync(cancellationToken);

        if (languages != null && !languages.Any(l => l.Code.ToLower().Equals(languageCode.ToLower())))
        {
          return new BadRequestObjectResult(@$"Language code {languageCode} is invalid or not supported!");
        }

        var countries = await _ssetOperationsService.GetCountriesAsync(languageCode, cancellationToken);

        if (countries != null && !countries.Any(l => l.Code.ToLower().Equals(countryCode.ToLower())))
        {
          return new BadRequestObjectResult(@$"Country code {countryCode} is invalid or not supported!");
        }

        var result = await _ssetOperationsService.GetProvincesAsync(languageCode, countryCode, cancellationToken);

        return new OkObjectResult(result);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName(nameof(GetPassengerFormLookupData))]
    public async Task<IActionResult> GetPassengerFormLookupData(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var languageCode = req.Query["languageCode"].FirstOrDefault();

        if (string.IsNullOrEmpty(languageCode))
        {
          return new BadRequestObjectResult("Language code is required!");
        }

        var languages = await _ssetOperationsService.GetLanguagesAsync(cancellationToken);

        if (languages != null && !languages.Any(l => l.Code.ToLower().Equals(languageCode.ToLower())))
        {
          return new BadRequestObjectResult(@$"Language code {languageCode} is invalid or not supported!");
        }

        var allTitles = await _ssetOperationsService.GetTitlesAsync(languageCode, cancellationToken);
        var allCountries = await _ssetOperationsService.GetCountriesAsync(languageCode, cancellationToken);
        var allStarAllianceTiers = await _ssetOperationsService.GetStarAllianceTiersAsync(languageCode, cancellationToken);
        var allRelationships = await _ssetOperationsService.GetRelationshipsAsync(languageCode, cancellationToken);

        IPassengerFormLookupData ssetFormData = new PassengerFormLookupData()
        {
          Titles = allTitles,
          Countries = allCountries,
          StarAllianceTiers = allStarAllianceTiers,
          Relationships = allRelationships
        };

        return new OkObjectResult(ssetFormData);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName(nameof(GetExpenseFormLookupData))]
    public async Task<IActionResult> GetExpenseFormLookupData(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var languageCode = req.Query["languageCode"].FirstOrDefault();

        if (string.IsNullOrEmpty(languageCode))
        {
          return new BadRequestObjectResult("Language code is required!");
        }

        var languages = await _ssetOperationsService.GetLanguagesAsync(cancellationToken);

        if (languages != null && !languages.Any(l => l.Code.ToLower().Equals(languageCode.ToLower())))
        {
          return new BadRequestObjectResult(@$"Language code {languageCode} is invalid or not supported!");
        }

        var allExpenseTypes = await _ssetOperationsService.GetExpenseTypesAsync(languageCode, cancellationToken);
        var allMealTypes = await _ssetOperationsService.GetMealTypesAsync(languageCode, cancellationToken);
        var allCurrencies = await _ssetOperationsService.GetCurrenciesAsync(languageCode, cancellationToken);
        var allTransportationTypes = await _ssetOperationsService.GetTransportationTypesAsync(languageCode, cancellationToken);

        IExpenseFormLookupData ssetFormData = new ExpenseFormLookupData()
        {
          ExpenseTypes = allExpenseTypes,
          MealTypes = allMealTypes,
          Currencies = allCurrencies,
          TransportationTypes = allTransportationTypes
        };

        return new OkObjectResult(ssetFormData);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName("CreateDynamicsWebRequest")]
    public async Task<IActionResult> CreateDynamicsWebRequestPublic(
      [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest request,
      CancellationToken cancellationToken,
      ILogger logger)
    {
      return await CreateDynamicsWebRequest(request, cancellationToken, logger, true);
    }

    [FunctionName("CreateDynamicsWebRequestPrivate")]
    public async Task<IActionResult> CreateDynamicsWebRequestPrivate(
      [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest request,
      CancellationToken cancellationToken,
      ILogger logger)
    {
      return await CreateDynamicsWebRequest(request, cancellationToken, logger, false);
    }

    [FunctionName(nameof(GetRegimes))]
    public async Task<IActionResult> GetRegimes(
     [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
     CancellationToken cancellationToken,
     ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var result = await _ssetOperationsService.GetRegimesAsync(cancellationToken);

        return new OkObjectResult(result);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    [FunctionName(nameof(GetOverrideOptions))]
    public async Task<IActionResult> GetOverrideOptions(
     [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req,
     CancellationToken cancellationToken,
     ILogger log)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.", cancellationToken);

        var result = await _ssetOperationsService.GetOverrideOptionsAsync(cancellationToken);

        return new OkObjectResult(result);
      }
      catch (AirCanada.ODE.CIP.APIClient.ApiException<AirCanada.ODE.CIP.APIClient.ValidationProblemDetails> ve)
      {
        log.LogWarning(ve, @$"{ve.Result.Detail}");
        return new BadRequestObjectResult(ve.Result.Detail);
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }

    private async Task<IActionResult> CreateDynamicsWebRequest(
      HttpRequest req,
      CancellationToken cancellationToken,
      ILogger log, 
      bool isRecaptchaEnabled)
    {
      try
      {
        log.LogInformation($"C# HTTP trigger function processed a request in {_runtimeContext.RuntimeEnvironment}.");

        #region Get the request body
        
        var options = new JsonSerializerOptions()
        {
          PropertyNameCaseInsensitive = true,

          Converters = { 
            new JsonStringEnumConverter(),
            new JsonStringDateTimeConverter(),
            new TypeMappingConverter<ISsetOriginDestinationRequest, SsetOriginDestinationRequest>(),
            new TypeMappingConverter<ISsetPassengerRequest, SsetPassengerRequest>(),
            new TypeMappingConverter<ISsetExpenseRequest, SsetExpenseRequest>(),
            new TypeMappingConverter<ISsetExpenseReceiptRequest, SsetExpenseReceiptRequest>()
          },
        };

        ISsetRequest ssetRequest = null;

        try
        {
          ssetRequest = await JsonSerializer.DeserializeAsync<SsetRequest>(req.Body, options);
        }
        catch (System.Exception ex)
        {
          var exception = ex;
          string exceptionMessage = string.Empty;

          while (exception != null)
          {
            exceptionMessage += exception.Message;
            exception = exception.InnerException;
          }

          log.LogError(ex, $"Error {exceptionMessage}.");
          return new BadRequestObjectResult(exceptionMessage);
        }

        #endregion

        #region Validate the recaptcha response token if the environment is UAT or PRD or if the reCaptcha is enabled

        //Validate the reCaptcha response token if the environment is UAT or PRD or if the reCaptcha is enabled
        if (isRecaptchaEnabled || _runtimeContext.RuntimeEnvironment.Equals(RuntimeEnvironment.UAT) || _runtimeContext.RuntimeEnvironment.Equals(RuntimeEnvironment.PRD))
        {
          var ssetReCaptchaValidationResponse = await _ssetOperationsService.ValidateRecaptcha(ssetRequest, cancellationToken);

          if (ssetReCaptchaValidationResponse.ReCaptchaValidationResults.Any())
          {
            return new OkObjectResult(ssetReCaptchaValidationResponse);
          }
        }

        #endregion

        #region Validate request input and create dynamics web request(s)

        var ssetResponse = await _ssetOperationsService.CreateDynamicsWebRequest(ssetRequest, cancellationToken);

        return new OkObjectResult(ssetResponse);

        #endregion
      }
      catch (System.Exception ex)
      {
        var exception = ex;
        string exceptionMessage = string.Empty;

        while (exception != null)
        {
          exceptionMessage += exception.Message;
          exception = exception.InnerException;
        }

        log.LogError(ex, $"Error {exceptionMessage}.");
        return new BadRequestObjectResult(exceptionMessage);
      }
    }
  }
}
