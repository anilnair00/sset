using System;
using System.Collections.Generic;
using System.Text;
using ODE.SSET.Interfaces;

namespace ODE.SSET.Core.Domain
{
  public class PassengerProtectionRequest : IPassengerProtectionRequest
  {
    public string PNR { get; set; }
    public string TicketNumber { get; set; }
  }
}
