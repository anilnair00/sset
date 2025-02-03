using System;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain
{
  public class RuntimeContext
  {
    public RuntimeContext()
    {
      AzureRuntimeEnvironment azureRuntimeEnvironment;
      if (Enum.TryParse<AzureRuntimeEnvironment>(Environment.GetEnvironmentVariable("AZURE_FUNCTIONS_ENVIRONMENT"), true, out azureRuntimeEnvironment))
      {
        switch (azureRuntimeEnvironment)
        {
          case AzureRuntimeEnvironment.Development:
            RuntimeEnvironment = RuntimeEnvironment.DIT;
            break;
          case AzureRuntimeEnvironment.SIT:
            RuntimeEnvironment = RuntimeEnvironment.SIT;
            break;
          case AzureRuntimeEnvironment.UAT:
            RuntimeEnvironment = RuntimeEnvironment.UAT;
            break;
          case AzureRuntimeEnvironment.PRD:
            RuntimeEnvironment = RuntimeEnvironment.PRD;
            break;
          default:
            throw new NotImplementedException($"The AzureRuntimeEnvironment {azureRuntimeEnvironment} is not supported.");
        }
      }
      else
      {
        throw new ArgumentOutOfRangeException(nameof(RuntimeEnvironment), Environment.GetEnvironmentVariable("AZURE_FUNCTIONS_ENVIRONMENT"), "Invalid AZURE_FUNCTIONS_ENVIRONMENT environment variable value.");
      }
    }

    public RuntimeEnvironment RuntimeEnvironment { get; set; }
  }
}
