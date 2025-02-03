namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces;
  using ODE.SSET.Interfaces.Dynamics;
  using System.Collections.Generic;

  public class SsetResponse : ISsetResponse
  {
    public IEnumerable<ISsetOriginDestinationResponse> OriginDestinations { get; set; }

    public string ExceptionMessage { get; set; }

    public IEnumerable<ISsetValidationException> ReCaptchaValidationResults { get; set; }

    public IEnumerable<ISsetValidationException> BusinessRuleValidationResults { get; set; }
  }
}
