using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using TechTalk.SpecFlow.Assist.ValueRetrievers;
using FluentAssertions;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.E2ETests
{
  [Binding, Scope(Feature = "Eligibility")]
  [Scope(Feature = "SnapshotSearch")]
  public class SnapshotSearchSteps
  {
    private readonly FeatureContext _featureContext;
    private readonly EligibilityResponse _eligibilityResponse;
    private GatewayRequest _gatewayRequest;
    private GatewayResponse _gatewayResponse;
    private HttpStatusCode _httpStatusCode;
    private static HttpClient _httpClient = null;

    public SnapshotSearchSteps(FeatureContext featureContext, EligibilityResponse eligibilityResponse)
    {
      _featureContext = featureContext;
      _eligibilityResponse = eligibilityResponse;
    }

    [BeforeTestRun]
    public static void BeforeTestRun()
    {
      Service.Instance.ValueRetrievers.Register(new NullValueRetriever("<null>"));
    }

    [Given(@"a passenger fills the Self Serve Eligibility form")]
    public void GivenAPassengerFillsTheSelfServeEligibilityForm(Table requestMessage)
    {
      _gatewayRequest = new GatewayRequest()
      {
        GatewayRequestContext = new GatewayRequestContext()
        {
          RuntimeEnvironment = _featureContext.Get<RuntimeEnvironment>(nameof(RuntimeEnvironment))
        },
        EligibilityRequest = requestMessage.CreateInstance<EligibilityRequest>()
      };
    }

    [When(@"the passenger submits the form")]
    public async Task WhenThePassengerSubmitsTheForm()
    {
      // Todo : Use HTTPS for DIT
      //UriBuilder uriBuilder = new UriBuilder()
      //{
      //  Scheme = "https",
      //  Host = featureContext.Get<string>(AppConfigKeys.SSET_Gateway_Host),
      //  Port = Convert.ToInt32(featureContext.Get<string>(AppConfigKeys.SSET_Gateway_Port))
      //};

      if (_httpClient == null)
      {
        _httpClient = new HttpClient()
        {
          BaseAddress = new Uri(_featureContext.Get<string>(AppConfigKeys.SSET_Gateway_URI))
        };
      }

      var functionKey = "osQoEZxhAaIpDvQjlVzI9HyFku1Bjg6KG22akvPRNPo6kizwPUk4yA==";
      var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, $"/api/GatewayPrivate?code={functionKey}")
      {
        Content = new StringContent(JsonSerializer.Serialize(_gatewayRequest))
      };

      var httpResponseMessage = await _httpClient.SendAsync(httpRequestMessage);

      _httpStatusCode = httpResponseMessage.StatusCode;

      var options = new JsonSerializerOptions()
      {
        PropertyNameCaseInsensitive = true
      };

      _gatewayResponse = await JsonSerializer.DeserializeAsync<GatewayResponse>(await httpResponseMessage.Content.ReadAsStreamAsync(), options);
      _eligibilityResponse.StatusCode = _gatewayResponse.EligibilityResponse.StatusCode;
      _eligibilityResponse.StatusDescription = _gatewayResponse.EligibilityResponse.StatusDescription;
      _eligibilityResponse.DisruptionCode = _gatewayResponse.EligibilityResponse.DisruptionCode;
      _eligibilityResponse.MostSignificantLegId = _gatewayResponse.EligibilityResponse.MostSignificantLegId;
      _eligibilityResponse.ArrivalDelayIATACode = _gatewayResponse.EligibilityResponse.ArrivalDelayIATACode;
      _eligibilityResponse.SecondaryCancellationReasonCode = _gatewayResponse.EligibilityResponse.SecondaryCancellationReasonCode;
    }

    [Then(@"the HTTP Status Code is Ok")]
    public void ThenTheHTTPStatusCodeIsOk()
    {
      _httpStatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Then(@"the snapshot list has (.*) item\(s\)")]
    public void ThenTheSnapshotListHasItemS(int itemCount)
    {
      _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.Count.Should().Be(itemCount);
    }

    [Then(@"item (.*) from the snapshot list is not removed")]
    public void ThenItemFromTheSnapshotListIsNotRemoved(int itemIndex)
    {
      _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.ElementAtOrDefault(itemIndex - 1).IsRemoved.Should().BeFalse();
    }

    [Then(@"the weight of item (.*) from the snapshot list is (.*)")]
    public void ThenTheWeightOfItemFromTheSnapshotListIs(int itemIndex, int weight)
    {
      _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.ElementAtOrDefault(itemIndex - 1).Weight.Should().Be(weight);
    }

    [Then(@"the weighting of item (.*) from the snapshot list is")]
    public void ThenTheWeightingOfItemFromTheSnapshotListIs(int itemIndex, Table expectedWeighting)
    {
      PassengerOriginDestinationWeighting expectedPAXODWeighting = expectedWeighting.CreateInstance<PassengerOriginDestinationWeighting>();
      PassengerOriginDestinationWeighting paxODWeighting = _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.ElementAtOrDefault(itemIndex - 1);
      paxODWeighting.IsFirstNameMatch.Should().Be(expectedPAXODWeighting.IsFirstNameMatch);
      paxODWeighting.IsLastNameMatch.Should().Be(expectedPAXODWeighting.IsLastNameMatch);
      paxODWeighting.IsInverseFirstNameMatch.Should().Be(expectedPAXODWeighting.IsInverseFirstNameMatch);
      paxODWeighting.IsInverseLastNameMatch.Should().Be(expectedPAXODWeighting.IsInverseLastNameMatch);
      paxODWeighting.IsFirstNameSubstringMatch.Should().Be(expectedPAXODWeighting.IsFirstNameSubstringMatch);
      paxODWeighting.IsLastNameSubstringMatch.Should().Be(expectedPAXODWeighting.IsLastNameSubstringMatch);
      paxODWeighting.IsDepartureLocalDateTimeMatch.Should().Be(expectedPAXODWeighting.IsDepartureLocalDateTimeMatch);
      paxODWeighting.IsDepartureLocalDateTimeFuzzyMatch.Should().Be(expectedPAXODWeighting.IsDepartureLocalDateTimeFuzzyMatch);
      paxODWeighting.IsArrivalLocalDateTimeMatch.Should().Be(expectedPAXODWeighting.IsArrivalLocalDateTimeMatch);
      paxODWeighting.IsArrivalLocalDateTimeFuzzyMatch.Should().Be(expectedPAXODWeighting.IsArrivalLocalDateTimeFuzzyMatch);
      paxODWeighting.IsTicketNumberMatch.Should().Be(expectedPAXODWeighting.IsTicketNumberMatch);
    }

    [Then(@"the PassengerOriginDestination of item (.*) from the snapshot list is")]
    public void ThenThePassengerOriginDestinationOfItemFromTheSnapshotListIs(int itemIndex, Table expectedPAXOD)
    {
      PassengerOriginDestinationWeighting expectedPAXODWeighting = expectedPAXOD.CreateInstance<PassengerOriginDestinationWeighting>();
      PassengerOriginDestinationWeighting paxODWeighting = _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.ElementAtOrDefault(itemIndex - 1);
      paxODWeighting.OriginDestinationCorrelationId.Should().Be(expectedPAXODWeighting.OriginDestinationCorrelationId);
      paxODWeighting.PNR.Should().Be(expectedPAXODWeighting.PNR);
      paxODWeighting.PNRCreationDateTime.Date.Should().Be(expectedPAXODWeighting.PNRCreationDateTime.Date);
      paxODWeighting.ProtectionPeriod.Should().Be(expectedPAXODWeighting.ProtectionPeriod);
      paxODWeighting.TicketNumber.FirstOrDefault().Should().Be(expectedPAXODWeighting.TicketNumber?.FirstOrDefault());
      paxODWeighting.MarketingAirlineCode.Trim().Should().Be(expectedPAXODWeighting.MarketingAirlineCode);
      paxODWeighting.MarketingFlightNumber.Should().Be(expectedPAXODWeighting.MarketingFlightNumber);
      paxODWeighting.AirlineCode.Trim().Should().Be(expectedPAXODWeighting.AirlineCode);
      paxODWeighting.FlightNumber.Should().Be(expectedPAXODWeighting.FlightNumber);
      paxODWeighting.DepartureAirport.Should().Be(expectedPAXODWeighting.DepartureAirport);
      paxODWeighting.ArrivalAirport.Should().Be(expectedPAXODWeighting.ArrivalAirport);
      paxODWeighting.DepartureDateTime.Should().Be(expectedPAXODWeighting.DepartureDateTime);
      paxODWeighting.DepartureLocalDateTime.Should().Be(expectedPAXODWeighting.DepartureLocalDateTime);
      paxODWeighting.ArrivalDateTime.Should().Be(expectedPAXODWeighting.ArrivalDateTime);
      paxODWeighting.ArrivalLocalDateTime.Should().Be(expectedPAXODWeighting.ArrivalLocalDateTime);
      paxODWeighting.FirstName.Should().Be(expectedPAXODWeighting.FirstName);
      paxODWeighting.LastName.Should().Be(expectedPAXODWeighting.LastName);
      paxODWeighting.DocumentFirstName.Should().Be(expectedPAXODWeighting.DocumentFirstName);
      paxODWeighting.DocumentMiddleName.Should().Be(expectedPAXODWeighting.DocumentMiddleName);
      paxODWeighting.DocumentLastName.Should().Be(expectedPAXODWeighting.DocumentLastName);
    }

    [Then(@"the PassengerOriginDestinationCorrelationId with the highest weight is '(.*)'")]
    public void ThenThePassengerOriginDestinationCorrelationIdWithTheHighestWeightIs(string expectedPAXCorrelationId)
    {
      var paxODWeighting = _gatewayResponse.PassengerProtectionResponse.PassengerOriginDestinationWeightings.OrderByDescending(o => o.Weight).FirstOrDefault();
      paxODWeighting.PassengerOriginDestinationCorrelationId.Should().Be(expectedPAXCorrelationId);
    }

    [Then(@"the status code is '(.*)' with description '(.*)'")]
    public void ThenTheStatusCodeIsWithDescription(int statusCode, string statusDescription)
    {
      _eligibilityResponse.StatusCode.Should().Be(statusCode);
      _eligibilityResponse.StatusDescription.Should().Be(statusDescription);
    }

    [Given(@"the request Runtime Environment is set to '(.*)'")]
    public void GivenTheRequestRuntimeEnvironmentIsSetTo(string targetEnvironment)
    {
      RuntimeEnvironment runtimeEnvironment = (RuntimeEnvironment) Enum.Parse(typeof(RuntimeEnvironment), targetEnvironment);
      _gatewayRequest.GatewayRequestContext.RuntimeEnvironment = runtimeEnvironment;
    }

    [Then(@"the HTTP Status Code is BadRequest")]
    public void ThenTheHTTPStatusCodeIsBadRequest()
    {
      _httpStatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
  }
}
