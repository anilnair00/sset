using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IGatewayRequest
  {
    public IGatewayRequestContext GatewayRequestContext { get; set; }
    public IEligibilityRequest EligibilityRequest { get; set; }
  }
}
