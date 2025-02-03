using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using TechTalk.SpecFlow;
using Xunit.Sdk;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces.Enums;
using Microsoft.VisualStudio.TestPlatform.CoreUtilities.Helpers;
using Microsoft.VisualStudio.TestPlatform.PlatformAbstractions;

namespace ODE.SSET.E2ETests
{
  [Binding]
  public class AppConfigurationHydrateStep
  {
    private readonly FeatureContext featureContext;

    public AppConfigurationHydrateStep(FeatureContext featureContext)
    {
      this.featureContext = featureContext;
    }

    [Given(@"the ODE:SSET keys are available from the Azure App Configuration Store")]
    public void GivenTheODESSETKeysAreAvailableFromTheAzureAppConfigurationStore()
    {
      RuntimeEnvironment runtimeEnvironment = InferRuntimeEnvironment();
      if (featureContext.ContainsKey(nameof(RuntimeEnvironment)))
      {
      }
      else
      {
        featureContext.Add(nameof(RuntimeEnvironment), runtimeEnvironment);
      }

      if (featureContext.ContainsKey(AppConfigKeys.SSET_Gateway_URI))
      {
      }
      else
      {
        InititalizeFeatureContext(ConfigurationRootFactory(runtimeEnvironment));
      }
    }

    private RuntimeEnvironment InferRuntimeEnvironment()
    {
      string environmentVariable = Environment.GetEnvironmentVariable("AZURE_FUNCTIONS_ENVIRONMENT");

      switch (environmentVariable)
      {
        case "PRD":
          return RuntimeEnvironment.PRD;
        case "SIT":
          return RuntimeEnvironment.SIT;
        case "UAT":
          return RuntimeEnvironment.UAT;
        default:
          return RuntimeEnvironment.DIT;
      }
    }

    private IConfigurationRoot ConfigurationRootFactory(RuntimeEnvironment runtimeEnvironment)
    {
      string appConfigurationStore = "Endpoint=https://ac-ode-odh-dev-canadacentral.azconfig.io;Id=eMGS-ll-s0:tkN9Bh7n99/MQJWF04vD;Secret=Pm0tshHbQi/SwN5XAwJxSFqo0IZDhtnAcbvaMKNFt/0=";
      ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
      configurationBuilder.AddAzureAppConfiguration(options => options
          .Connect(appConfigurationStore)
          .Select(KeyFilter.Any, LabelFilter.Null)
          .Select(KeyFilter.Any, runtimeEnvironment.ToString())
      );
      return configurationBuilder.Build();
    }

    private void InititalizeFeatureContext(IConfigurationRoot configurationRoot) 
    {
      featureContext.Add(AppConfigKeys.CIP_Server_URL, configurationRoot[AppConfigKeys.CIP_Server_URL]);
      featureContext.Add(AppConfigKeys.SSET_Gateway_URI, configurationRoot[AppConfigKeys.SSET_Gateway_URI]);
    }
  }
}
