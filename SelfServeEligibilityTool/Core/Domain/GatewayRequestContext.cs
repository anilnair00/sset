using System;
using System.Collections.Generic;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain
{
  public class GatewayRequestContext
  {
    public GatewayRequestContext()
    {
      ValidationExceptions = new List<ValidationException>();
    }

    // BRE 10_00_XX
    public RuntimeEnvironment RuntimeEnvironment { get; set; }
    public string RecaptchaResponseToken { get; set; }
    public bool IsRecaptchaEnabled { get; set; } = true;
    public List<ValidationException> ValidationExceptions { get; set; }

    public void AddValidationResult(ValidationException validationResult)
    {
      if (validationResult is null)
        throw new ArgumentNullException(nameof(validationResult));

      ValidationExceptions.Add(validationResult);
    }
  }
}
