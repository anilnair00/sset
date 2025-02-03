using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IGatewayResponse
  {
    public IEligibilityResponse EligibilityResponse { get; set; }
    public string ExceptionMessage { get; set; }
    public IGatewayRequest GatewayRequest { get; set; }
    public IPassengerProtectionResponse PassengerProtectionResponse { get; set; }
  }
}
