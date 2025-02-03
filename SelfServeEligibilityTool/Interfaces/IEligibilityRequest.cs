using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IEligibilityRequest
  {
    public string PNR { get; set; }
    public DateTimeOffset FlightDate { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string TicketNumber { get; set; }
  }
}
