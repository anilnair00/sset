using System.Collections.Generic;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Interfaces
{
  public interface IGatewayRequestContext
  {
    public RuntimeEnvironment RuntimeEnvironment { get; set; }
    public string RecaptchaResponseToken { get; set; }
    public bool IsRecaptchaEnabled { get; set; }
    public List<IValidationException> ValidationExceptions { get; set; }
  }
}
