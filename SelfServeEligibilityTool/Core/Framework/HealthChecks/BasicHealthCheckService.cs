using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ODE.SSET.Core.Framework.HealthChecks
{
  internal class BasicHealthCheckService : HealthCheckService
  {
    private IServiceProvider _serviceProvider;

    public BasicHealthCheckService(IServiceProvider serviceProvider)
    {
      _serviceProvider = serviceProvider;
    }

    public override async Task<HealthReport> CheckHealthAsync(
      Func<HealthCheckRegistration, bool> predicate, CancellationToken cancellationToken = default)
    {
      var entries = new SortedDictionary<string, HealthReportEntry>();

      foreach (var healthCheck in _serviceProvider.GetServices<IHealthCheck>())
      {
        var healthCheckName = healthCheck.GetType().Name;

        var context = new HealthCheckContext
        {
          Registration = new HealthCheckRegistration(healthCheckName, healthCheck, null, null)
        };

        var healthCheckResult = await healthCheck.CheckHealthAsync(context);
        entries.Add(
          healthCheckName,
          new HealthReportEntry(
            healthCheckResult.Status, 
            healthCheckResult.Description, 
            TimeSpan.Zero, 
            healthCheckResult.Exception, 
            healthCheckResult.Data));
      }

      return new HealthReport(entries, TimeSpan.Zero);
    }
  }
}
