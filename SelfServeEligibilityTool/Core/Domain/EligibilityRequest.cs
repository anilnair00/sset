using System;
using ODE.SSET.Interfaces;

namespace ODE.SSET.Core.Domain
{
  // BRE 10_XX_XX
  public class EligibilityRequest
  {
    // BRE 10_10_XX
    public string PNR { get ; set ; }
    // BRE 10_20_XX
    public string TicketNumber { get; set; }
    // BRE 10_30_XX
    public DateTimeOffset FlightDate { get ; set ; }
    // BRE 10_40_XX
    public string FirstName { get ; set ; }
    // BRE 10_50_XX
    public string LastName { get ; set ; }
  }
}
