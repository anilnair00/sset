using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Interfaces;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain
{
  public class GatewayRequest
  {
    public string SessionId { get; set; }

    public SsetOperationType OperationType { get; set; }

    public GatewayRequestContext GatewayRequestContext { get; set; }
    public EligibilityRequest EligibilityRequest { get; set; }
  }
}
