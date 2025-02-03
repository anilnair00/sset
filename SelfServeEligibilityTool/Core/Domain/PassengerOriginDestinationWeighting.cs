using System;
using System.Collections.Generic;
using System.Text;
using ODE.SSET.Interfaces;

namespace ODE.SSET.Core.Domain
{
  public class PassengerOriginDestinationWeighting : PassengerOriginDestination, IPassengerOriginDestinationWeighting
  {
    public bool IsFirstNameMatch { get; set; }
    public bool IsLastNameMatch { get; set; }
    public bool IsInverseFirstNameMatch { get; set; }
    public bool IsInverseLastNameMatch { get; set; }
    public bool IsFirstNameSubstringMatch { get; set; }
    public bool IsLastNameSubstringMatch { get; set; }
    //public bool IsDocumentFirstNameMatch { get; set; }
    public bool IsDepartureLocalDateTimeMatch { get; set; }
    public bool IsDepartureLocalDateTimeFuzzyMatch { get; set; }
    public bool IsArrivalLocalDateTimeMatch { get; set; }
    public bool IsArrivalLocalDateTimeFuzzyMatch { get; set; }
    //public bool IsFlightDateMatch { get; set; }
    public bool IsTicketNumberMatch { get; set; }
    public bool IsRemoved { get; set; }
    public int Weight { get; set; }

    public void MatchFirstName()
    {
      IsFirstNameMatch = true;
      Weight += 8;
    }
    public void MatchLastName()
    {
      IsLastNameMatch = true;
      Weight += 8;
    }
    public void MatchInverseFirstName()
    {
      IsInverseFirstNameMatch = true;
      Weight += 5;
    }
    public void MatchInverseLastName()
    {
      IsInverseLastNameMatch = true;
      Weight += 5;
    }
    public void MatchFirstNameSubstring()
    {
      IsFirstNameSubstringMatch = true;
      Weight += 3;
    }
    public void MatchLastNameSubstring()
    {
      IsLastNameSubstringMatch = true;
      Weight += 3;
    }
    public void MatchDepartureLocalDateTime()
    {
      IsDepartureLocalDateTimeMatch = true;
      Weight += 8;
    }
    public void MatchFuzzyDepartureLocalDateTime()
    {
      IsDepartureLocalDateTimeFuzzyMatch = true;
      Weight += 3;
    }
    public void MatchArrivalLocalDateTime()
    {
      IsArrivalLocalDateTimeMatch = true;
      Weight += 8;
    }
    public void MatchFuzzyArrivalLocalDateTime()
    {
      IsArrivalLocalDateTimeFuzzyMatch = true;
      Weight += 3;
    }
    public void MatchTicketNumber()
    {
      IsTicketNumberMatch = true;
      Weight += 13;
    }
    public void RemoveOD()
    {
      IsRemoved = true;
    }
  }
}
