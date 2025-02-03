using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using TechTalk.SpecFlow;
using FluentAssertions;
using FluentAssertions.Common;
using TechTalk.SpecFlow.Configuration.JsonConfig;
using Google.Protobuf.WellKnownTypes;
using ODE.SSET.Core.Domain;

namespace ODE.SSET.E2ETests
{
  [Binding]
  public class AppConfigurationSteps
  {
    private readonly FeatureContext featureContext;
    private string configItemKeyValue;

    public AppConfigurationSteps(FeatureContext featureContext)
    {
      this.featureContext = featureContext;
    }

    [Given(@"The key '(.*)'")]
    public void GivenTheKey(string key)
    {
      switch (key)
      {
        case "ODE:CIP:Settings:Server:URL":
          configItemKeyValue = featureContext.Get<string>(AppConfigKeys.CIP_Server_URL);
          break;
        default:
          break;
      }
    }

    [When(@"The configuration item is retrieved from the App Configuration store")]
    public void WhenTheConfigurationItemIsRetrievedFromTheAppConfigurationStore()
    {
    }

    [Then(@"The key-value is '(.*)'")]
    public void ThenTheKey_ValueIs(string keyValue)
    {
      configItemKeyValue.Should().Be("acode-pcat-sit.azurewebsites.net");
    }
  }
}
