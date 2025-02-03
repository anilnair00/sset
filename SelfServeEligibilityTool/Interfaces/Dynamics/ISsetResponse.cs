namespace ODE.SSET.Interfaces.Dynamics
{
  using System.Collections.Generic;

  public interface ISsetResponse
  {
    public IEnumerable<ISsetOriginDestinationResponse> OriginDestinations { get; set; }

    public string ExceptionMessage { get; set; }

    public IEnumerable<ISsetValidationException> ReCaptchaValidationResults { get; set; }

    public IEnumerable<ISsetValidationException> BusinessRuleValidationResults { get; set; }
  }
}
