using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ODE.SSET.Core.Recaptcha
{
  public class VerificationResponse
  {
    public bool Success { get; set; }
    public float Score { get; set; }
    public string HostName { get; set; }
    [JsonPropertyName("error-codes")]
    public string[] ErrorCodes { get; set; }
  }
}
