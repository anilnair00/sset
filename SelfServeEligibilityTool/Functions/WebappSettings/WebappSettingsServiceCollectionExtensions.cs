using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using ODE.SSET.Functions.WebappSettings;

namespace Microsoft.Extensions.DependencyInjection
{
    internal static class WebappSettingsServiceCollectionExtensions
    {
        public static IServiceCollection AddWebappSettings(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<WebappSettingsOptions>(configuration.GetSection("Webapp"));

            return services;
        }
    }
}
