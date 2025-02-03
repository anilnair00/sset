using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;
using FluentAssertions;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces.Enums;
using TechTalk.SpecFlow.Assist.ValueRetrievers;

namespace ODE.SSET.E2ETests
{
  [Binding, Scope(Feature = "GatewayRequestValidator")]
  [Scope(Feature = "RuntimeEnvironment")]
  public class GatewayRequestValidatorSteps
  {
    private readonly FeatureContext _featureContext;
    private GatewayRequest _gatewayRequest;
    private HttpStatusCode _httpStatusCode;
    private HttpResponseMessage _httpResponseMessage;
    private static HttpClient _httpClient = null;

    public GatewayRequestValidatorSteps(FeatureContext featureContext)
    {
      _featureContext = featureContext;
    }

    [BeforeTestRun]
    public static void BeforeTestRun()
    {
      Service.Instance.ValueRetrievers.Register(new NullValueRetriever("<null>"));
    }

    [Given(@"the message request payload contains")]
    public void GivenTheMessageRequestPayloadContains(Table requestMessage)
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

    [When(@"I send a message to the gateway endpoint")]
    public async Task WhenISendAMessageToTheGatewayEndpoint()
    {
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

      _httpResponseMessage = await _httpClient.SendAsync(httpRequestMessage);

      _httpStatusCode = _httpResponseMessage.StatusCode;
    }

    [Then(@"the response message highlights my mistakes")]
    public void ThenTheResponseMessageHighlightsMyMistakes()
    {
      _httpStatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Then(@"the response message contains the expected (.*)")]
    public async Task ThenTheResponseMessageContainsTheExpected(string businessRuleCodeList)
    {
      var codeList =
        businessRuleCodeList
          .Split(',', StringSplitOptions.RemoveEmptyEntries)
          .Select(p => int.Parse(p));

      var options = new JsonSerializerOptions()
      {
        PropertyNameCaseInsensitive = true
      };

      var gatewayResponse = await JsonSerializer.DeserializeAsync<GatewayResponse>(await _httpResponseMessage.Content.ReadAsStreamAsync(), options);

      var codesAreEqual =
        gatewayResponse
          .GatewayRequest
          .GatewayRequestContext
          .ValidationExceptions
          ?.Select(v => v.BusinessRuleCode)
          .ToHashSet()
          .SetEquals(codeList)
            ?? false;

      codesAreEqual.Should().BeTrue();
    }

    [Given(@"the request Runtime Environment is set to '(.*)'")]
    public void GivenTheRequestRuntimeEnvironmentIsSetTo(string targetEnvironment)
    {
      RuntimeEnvironment runtimeEnvironment = (RuntimeEnvironment)Enum.Parse(typeof(RuntimeEnvironment), targetEnvironment);
      _gatewayRequest.GatewayRequestContext.RuntimeEnvironment = runtimeEnvironment;
    }
  }
}
