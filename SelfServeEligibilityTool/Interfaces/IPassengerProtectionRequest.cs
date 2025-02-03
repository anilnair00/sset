using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IPassengerProtectionRequest
  {
    public string PNR { get; set; }
    public string TicketNumber { get; set; }
  }
}
