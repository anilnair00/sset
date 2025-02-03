using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ODE.SSET.Functions.General
{
  public class GeneralFunctions
  {
    private readonly HealthCheckService _healthCheckService;

    public GeneralFunctions(HealthCheckService healthCheckService)
    {
      _healthCheckService = healthCheckService;
    }

    [FunctionName("Health")]
    public async Task<ActionResult<HealthReport>> Run(
      [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
    {
      var result = await _healthCheckService.CheckHealthAsync();

      return new OkObjectResult(result);
    }
  }
}
