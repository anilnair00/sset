using System;
using AirCanada.ODE.CIP.APIClient;
using Azure.Storage.Blobs;
using Azure.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using ODE.SSET.Core;
using ODE.SSET.Core.BRE;
using ODE.SSET.Core.CIP;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Framework.CIP;
using ODE.SSET.Core.Framework.HealthChecks;
using ODE.SSET.Core.Framework.HTTP;
using ODE.SSET.Core.Framework.IdentityProvider;
using ODE.SSET.Core.Framework.IdentityProvider.Cache;
using ODE.SSET.Core.Recaptcha;
using ODE.SSET.Interfaces;
using ODE.SSET.Core.MalwareScanning;
using Microsoft.Extensions.Caching.Memory;

namespace Microsoft.Extensions.DependencyInjection
{
  public static class CoreServiceCollectionExtensions
  {
    public static void AddCore(this IServiceCollection services, IConfiguration configuration)
    {
      // Health Checks
      services.AddSingleton<HealthCheckService, BasicHealthCheckService>();

      // IDP
      services.Configure<IdentityProviderOptions>(configuration.GetSection("IDP"));

      services.AddHttpClient<IIdentityProviderService, IdentityProviderService>((serviceProvider, httpClient) =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<IdentityProviderOptions>>().Value;

        httpClient.BaseAddress = new Uri(options.BaseAddress);
      });

      services.AddSingleton<IIdentityProviderCache, IdentityProviderCache>();

      // CIP
      services.Configure<CipClientOptions>(configuration.GetSection("CIP"));

      services.AddHttpClient<IItinerariesClient, ItinerariesClient>((serviceProvider, httpClient) =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<CipClientOptions>>().Value;

        httpClient.BaseAddress = new Uri(options.BaseAddress);
      })
      .AddHttpMessageHandler<AuthenticationHandler>();

      services.AddTransient<AuthenticationHandler>();

      services.AddScoped<IODSearchService, ODSearchService>();
      services.AddScoped<IFlightDisruptionService, FlightDisruptionService>();
      
      services.AddSingleton<PassengerODMapper>();
      services.AddSingleton<FlightDisruptionResultMapper>();

      services.AddHttpClient<IClaimsProcessingClient, ClaimsProcessingClient>((serviceProvider, httpClient) =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<CipClientOptions>>().Value;

        httpClient.BaseAddress = new Uri(options.BaseAddress);
      })
      .AddHttpMessageHandler<AuthenticationHandler>();

      services.AddHttpClient<ISsetOperationsClient, SsetOperationsClient>((serviceProvider, httpClient) =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<CipClientOptions>>().Value;

        httpClient.BaseAddress = new Uri(options.BaseAddress);
      })
      .AddHttpMessageHandler<AuthenticationHandler>();

      services.AddSingleton<IHealthCheck, ClaimsProcessingHealthCheck>();

      // Recaptcha
      services.Configure<RecaptchaOptions>(configuration.GetSection("Recaptcha"));
      services.AddHttpClient<VerificationService, VerificationService>(httpClient =>
      {
        httpClient.BaseAddress = new Uri("https://www.google.com/recaptcha/api/");
      });


      // BRE
      services.AddSingleton<RuntimeContext>();
      services.AddSingleton<Repository>();
      services.AddSingleton<Factory>();
      services.AddScoped<RuleEngine>();
      services.AddScoped<ValidationService>();
      services.AddScoped<OriginDestinationService>();
      services.AddScoped<AssessmentService>();


      //Dynamics
      services.Configure<ReceiptFileOptions>(configuration.GetSection("Receipt"));
      services.AddSingleton<ISsetOperationsService, SsetOperationsService>(serviceProvider =>
      {
        var receiptOptionsService = serviceProvider.GetRequiredService<IOptions<ReceiptFileOptions>>();
        var receiptOptions = receiptOptionsService.Value;

        var credentials = new StorageSharedKeyCredential(receiptOptions.StorageAccountName, receiptOptions.StorageAccountKey);
        var blobUri = new Uri($"https://{receiptOptions.StorageAccountName}.blob.core.windows.net");
        var blobServiceClient = new BlobServiceClient(blobUri, credentials);

        return new SsetOperationsService(serviceProvider.GetRequiredService<IOptions<RecaptchaOptions>>(),
          blobServiceClient, serviceProvider.GetRequiredService<ISsetOperationsClient>(),
          serviceProvider.GetRequiredService<VerificationService>(),
          serviceProvider.GetRequiredService<IMemoryCache>());
      });
    }
  }
}
