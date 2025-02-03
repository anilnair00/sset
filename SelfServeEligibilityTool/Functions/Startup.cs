using Azure.Identity;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

[assembly: FunctionsStartup(typeof(ODE.SSET.Functions.Startup))]
namespace ODE.SSET.Functions
{
  public class Startup : FunctionsStartup
  {
    public override void Configure(IFunctionsHostBuilder builder)
    {
      builder.Services.AddOptions();

      var configuration = BuildConfiguration(builder);

      builder.Services.AddCore(configuration);
      builder.Services.AddWebappSettings(configuration);
    }

    private IConfiguration BuildConfiguration(IFunctionsHostBuilder builder)
    {
      var serviceProvider = builder.Services.BuildServiceProvider();
      var hostBuilderContext = serviceProvider.GetRequiredService<HostBuilderContext>();

      var configBuilder = new ConfigurationBuilder();

      var environmentName = hostBuilderContext.HostingEnvironment.EnvironmentName;
      if (hostBuilderContext.HostingEnvironment.EnvironmentName == "Development")
      {
        configBuilder.AddUserSecrets<Startup>();
        environmentName = "DIT";
      }

      if (hostBuilderContext.Configuration["AzureAppConfiguration"] is string azureAppConfiguration)
      {
        configBuilder.AddAzureAppConfiguration(options => options
          .Connect(azureAppConfiguration)
          .Select("ODE:SSET:*", environmentName)
          .TrimKeyPrefix("ODE:SSET:")
          .ConfigureKeyVault(keyVaultOptions =>
          {
            keyVaultOptions.SetCredential(new DefaultAzureCredential());
          }));
      }

      // This means environment variables override Azure App Configuration
      configBuilder.AddEnvironmentVariables();

      return configBuilder.Build();
    }
  }
}
