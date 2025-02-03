using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IPassengerOriginDestinationWeighting
  {
    public bool IsFirstNameMatch { get; set; }
    public bool IsLastNameMatch { get; set; }
    public bool IsInverseFirstNameMatch { get; set; }
    public bool IsInverseLastNameMatch { get; set; }
    public bool IsFirstNameSubstringMatch { get; set; }
    public bool IsLastNameSubstringMatch { get; set; }
    //public bool IsDocumentFirstNameMatch { get; set; }
    //public bool IsDocumentLastNameMatch { get; set; }
    public bool IsDepartureLocalDateTimeMatch { get; set; }
    public bool IsDepartureLocalDateTimeFuzzyMatch { get; set; }
    public bool IsArrivalLocalDateTimeMatch { get; set; }
    public bool IsArrivalLocalDateTimeFuzzyMatch { get; set; }
    //public bool IsFlightDateMatch { get; set; }
    public bool IsTicketNumberMatch { get; set; }
    public bool IsRemoved { get; set; }
    public int Weight { get; set; }
  }
}
