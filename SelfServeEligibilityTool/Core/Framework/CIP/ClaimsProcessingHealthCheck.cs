using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ODE.SSET.Core.Framework.CIP
{
  public class ClaimsProcessingHealthCheck : IHealthCheck
  {
    private IServiceProvider _serviceProvider;

    public ClaimsProcessingHealthCheck(IServiceProvider serviceProvider)
    {
      _serviceProvider = serviceProvider;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
      try
      {
        var client = _serviceProvider.GetRequiredService<AirCanada.ODE.CIP.APIClient.IClaimsProcessingClient>();
        await client.GetFlightDisruptionClaimAsync(null, 0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        return new HealthCheckResult(HealthStatus.Healthy);
      }
      catch (Exception ex)
      {
        return new HealthCheckResult(HealthStatus.Unhealthy, exception: ex);
      }
    }
  }
}
