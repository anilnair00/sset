using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Core.Domain;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using FluentAssertions;
using Microsoft.Extensions.Options;
using ODE.SSET.Core.Framework.IdentityProvider.Cache;
using ODE.SSET.Core.Framework.IdentityProvider;
using TechTalk.SpecFlow.Assist.ValueRetrievers;

namespace ODE.SSET.E2ETests
{
  [Binding]
  public class FlightDisruptionSteps
  {
    private readonly FeatureContext _featureContext;
    private AssessmentRequest _assessmentRequest;
    private HttpStatusCode _httpStatusCode;
    private FlightDisruptionResult _resultModel;
    private static HttpClient _httpClient = null;
    private static string _token = null;

    public FlightDisruptionSteps(FeatureContext featureContext)
    {
      _featureContext = featureContext;
    }

    [Given(@"the Assessment Request")]
    public void GivenTheAssessmentRequest(Table table)
    {
      _assessmentRequest = table.CreateInstance<AssessmentRequest>();
    }

    [When(@"I submit the request to the flight disruption API")]
    public async Task WhenISubmitTheRequestToTheFlightDisruptionAPI()
    {
      if (_httpClient == null)
      {
        var cipServerUrl = _featureContext.Get<string>(AppConfigKeys.CIP_Server_URL);

        _httpClient = new HttpClient()
        {
          BaseAddress = new Uri($"https://{cipServerUrl}")
        };
      }

      using (var request = new System.Net.Http.HttpRequestMessage())
      {
        request.Method = new System.Net.Http.HttpMethod("GET");
        request.Headers.Accept.Add(System.Net.Http.Headers.MediaTypeWithQualityHeaderValue.Parse("application/json"));

        var urlWithParams = BuildUrl();
        request.RequestUri = new System.Uri(urlWithParams, System.UriKind.RelativeOrAbsolute);

        if (_token == null)
        {
          _token = await GetToken();
        }

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _token);
        var response = await _httpClient.SendAsync(request).ConfigureAwait(false);
        _httpStatusCode = response.StatusCode;

        var objectResponse = await ReadObjectResponseAsync<FlightDisruptionResult>(response).ConfigureAwait(false);
        _resultModel = objectResponse.Object;
      }
    }

    [Then(@"the HTTP Status Code is Ok")]
    public void ThenTheHTTPStatusCodeIsOk()
    {
      _httpStatusCode.Should().Be(HttpStatusCode.OK);
    }

    [BeforeTestRun]
    public static void BeforeTestRun()
    {
      Service.Instance.ValueRetrievers.Register(new NullValueRetriever("<null>"));
    }

    [Then(@"the most significant leg id is '(.*)'")]
    public void ThenTheMostSignificantLegIdIs(string mslId)
    {
      _resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegId.Should().Be(mslId);
    }

    [Then(@"the FdResponse is")]
    public void ThenTheFdResponseIs(Table expectedResponse)
    {
      FdResponse expectedFdResponse = expectedResponse.CreateInstance<FdResponse>();
      _resultModel.MatchAndClaimEligibilityCode.Should().Be(expectedFdResponse.MatchAndClaimEligibilityCode);
      _resultModel.MatchAndClaimEligibility.Should().Be(expectedFdResponse.MatchAndClaimEligibility);
      _resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegId.Should().Be(expectedFdResponse.MostSignificantLegId);

      int? delayIataCode = null;
      string secondaryCancellationReasonCode = null;

      if (_resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegSource == FlightDisruptionMostSignificantLegSource.FlownFlights)
      {
        var mostSignificantLeg = _resultModel
          .ActualFlightDisruptionItineraryAnalysisResult?
          .ActualLegsMatchedToSnapshotOD?
          .Where(l => l.Id == _resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegId)
          .FirstOrDefault();

        if (mostSignificantLeg == null)
        {
          mostSignificantLeg = _resultModel
          .ActualFlightDisruptionItineraryAnalysisResult?
          .ActualNotBoardedLegsMatchedToSnapshotOD?
          .Where(l => l.Id == _resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegId)
          .FirstOrDefault();
        }

        delayIataCode = mostSignificantLeg.DelayIataCode;
      }
      else if (_resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegSource == FlightDisruptionMostSignificantLegSource.CancelledFlights)
      {
        var mostSignificantLeg = _resultModel
          .ActualItinerary?
          .CancelledLegs?
          .Where(l => l.Id == _resultModel.ActualFlightDisruptionItineraryAnalysisResult.MostSignificantLegId)
          .FirstOrDefault();

        secondaryCancellationReasonCode = mostSignificantLeg?.SecondaryCancellationReasonCode;
      }

      delayIataCode.Should().Be(expectedFdResponse.DelayIataCode);
      secondaryCancellationReasonCode.Should().Be(expectedFdResponse.SecondaryCancellationReasonCode);
    }

    private class FdResponse
    {
      public int MatchAndClaimEligibilityCode { get; set; }
      public FlightDisruptionMatchAndEligibilityStatus MatchAndClaimEligibility { get; set; }
      public string MostSignificantLegId { get; set; }
      public int? DelayIataCode { get; set; }
      public string SecondaryCancellationReasonCode { get; set; }
    }

    private async Task<string> GetToken()
    {
      var httpClient = new HttpClient()
      {
        BaseAddress = new Uri("https://fs-int.aircanada.ca")
      };

      IIdentityProviderCache cache = new IdentityProviderCache();

      IOptions<IdentityProviderOptions> options = Options.Create(new IdentityProviderOptions()
      {
        ClientId = "AirCanada.Services.SSET",
        ClientSecret = "wYAbmlkVyamnQ7LpgemsAiOBmYLmKX9TQ709y2zu0sRz5a1Y5adIMiXvB2fk9hpK"
      });

      IIdentityProviderService identityProviderService = new IdentityProviderService(httpClient, cache, options);

      var token = await identityProviderService.LoginAsync();
      return token;
    }

    private string BuildUrl()
    {
      var urlBuilder = new System.Text.StringBuilder();
      urlBuilder.Append("api/v1/claimsprocessing/flightdisruption?");
      urlBuilder.Append("Airline=").Append(System.Uri.EscapeDataString(_assessmentRequest.Airline != null ? ConvertToString(_assessmentRequest.Airline, System.Globalization.CultureInfo.InvariantCulture) : "")).Append("&");
      urlBuilder.Append("FlightNumber=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.FlightNumber, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      if (_assessmentRequest.OperatingAirlineFlightNumber != null)
      {
        urlBuilder.Append("OperatingAirlineFlightNumber=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.OperatingAirlineFlightNumber, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      urlBuilder.Append("DepartureDate=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.DepartureDate, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      urlBuilder.Append("DepartureAirport=").Append(System.Uri.EscapeDataString(_assessmentRequest.DepartureAirport != null ? ConvertToString(_assessmentRequest.DepartureAirport, System.Globalization.CultureInfo.InvariantCulture) : "")).Append("&");
      urlBuilder.Append("ArrivalAirport=").Append(System.Uri.EscapeDataString(_assessmentRequest.ArrivalAirport != null ? ConvertToString(_assessmentRequest.ArrivalAirport, System.Globalization.CultureInfo.InvariantCulture) : "")).Append("&");
      urlBuilder.Append("FirstName=").Append(System.Uri.EscapeDataString(_assessmentRequest.FirstName != null ? ConvertToString(_assessmentRequest.FirstName, System.Globalization.CultureInfo.InvariantCulture) : "")).Append("&");
      urlBuilder.Append("LastName=").Append(System.Uri.EscapeDataString(_assessmentRequest.LastName != null ? ConvertToString(_assessmentRequest.LastName, System.Globalization.CultureInfo.InvariantCulture) : "")).Append("&");
      if (_assessmentRequest.PNR != null)
      {
        urlBuilder.Append("PNR=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.PNR, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      if (_assessmentRequest.TicketNumber != null)
      {
        urlBuilder.Append("TicketNumber=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.TicketNumber, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      if (_assessmentRequest.ClaimDate != null)
      {
        urlBuilder.Append("ClaimDate=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.ClaimDate, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      if (_assessmentRequest.DynamicsCaseId != null)
      {
        urlBuilder.Append("DynamicsCaseId=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.DynamicsCaseId, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      if (_assessmentRequest.DynamicsCaseNumber != null)
      {
        urlBuilder.Append("DynamicsCaseNumber=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.DynamicsCaseNumber, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      if (_assessmentRequest.SnapshotAdvanceDays != null)
      {
        urlBuilder.Append("SnapshotAdvanceDays=").Append(System.Uri.EscapeDataString(ConvertToString(_assessmentRequest.SnapshotAdvanceDays, System.Globalization.CultureInfo.InvariantCulture))).Append("&");
      }
      urlBuilder.Length--;

      return urlBuilder.ToString();
    }

    private async System.Threading.Tasks.Task<ObjectResponseResult<T>> ReadObjectResponseAsync<T>(System.Net.Http.HttpResponseMessage response)
    {
        using (var responseStream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
        using (var streamReader = new System.IO.StreamReader(responseStream))
        using (var jsonTextReader = new Newtonsoft.Json.JsonTextReader(streamReader))
        {
          var serializer = Newtonsoft.Json.JsonSerializer.Create();
          var typedBody = serializer.Deserialize<T>(jsonTextReader);
          return new ObjectResponseResult<T>(typedBody, string.Empty);
        }
    }

    private struct ObjectResponseResult<T>
    {
      public ObjectResponseResult(T responseObject, string responseText)
      {
        this.Object = responseObject;
        this.Text = responseText;
      }

      public T Object { get; }

      public string Text { get; }
    }

    private string ConvertToString(object value, System.Globalization.CultureInfo cultureInfo)
    {
      if (value is System.Enum)
      {
        string name = System.Enum.GetName(value.GetType(), value);
        if (name != null)
        {
          var field = System.Reflection.IntrospectionExtensions.GetTypeInfo(value.GetType()).GetDeclaredField(name);
          if (field != null)
          {
            var attribute = System.Reflection.CustomAttributeExtensions.GetCustomAttribute(field, typeof(System.Runtime.Serialization.EnumMemberAttribute))
                as System.Runtime.Serialization.EnumMemberAttribute;
            if (attribute != null)
            {
              return attribute.Value != null ? attribute.Value : name;
            }
          }
        }
      }
      else if (value is bool)
      {
        return System.Convert.ToString(value, cultureInfo).ToLowerInvariant();
      }
      else if (value is byte[])
      {
        return System.Convert.ToBase64String((byte[])value);
      }
      else if (value != null && value.GetType().IsArray)
      {
        var array = System.Linq.Enumerable.OfType<object>((System.Array)value);
        return string.Join(",", System.Linq.Enumerable.Select(array, o => ConvertToString(o, cultureInfo)));
      }
      else if (value is DateTimeOffset date)
      {
        return date.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture);
      }

      return System.Convert.ToString(value, cultureInfo);
    }
  }
}
