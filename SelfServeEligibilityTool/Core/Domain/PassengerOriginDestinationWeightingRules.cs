using System;
using System.Collections.Generic;
using System.Text;
using NRules.Fluent.Dsl;

namespace ODE.SSET.Core.Domain
{
  [Tag("Weighting")]
  public class PassengerODMatchFirstNameRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.FirstName))
        .Exists<EligibilityRequest>(r => string.Equals(r.FirstName, passengerOriginDestinationWeighting.FirstName.Replace(" ", string.Empty), StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchFirstName());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchLastNameRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.LastName))
        .Exists<EligibilityRequest>(r => string.Equals(r.LastName, passengerOriginDestinationWeighting.LastName.Replace(" ", string.Empty), StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchLastName());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchInverseFirstNameRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.FirstName))
        .Exists<EligibilityRequest>(r => string.Equals(r.LastName, passengerOriginDestinationWeighting.FirstName.Replace(" ", string.Empty), StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchInverseFirstName());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchInverseLastNameRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.LastName))
        .Exists<EligibilityRequest>(r => string.Equals(r.FirstName, passengerOriginDestinationWeighting.LastName.Replace(" ", string.Empty), StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchInverseLastName());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchFirstNameSubstringRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.FirstName))
        .Exists<EligibilityRequest>(r => !string.IsNullOrEmpty(r.FirstName) && passengerOriginDestinationWeighting.FirstName.Replace(" ", string.Empty).Contains(r.FirstName, StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchFirstNameSubstring());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchLastNameSubstringRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => !string.IsNullOrEmpty(od.LastName))
        .Exists<EligibilityRequest>(r => !string.IsNullOrEmpty(r.LastName) && passengerOriginDestinationWeighting.LastName.Replace(" ", string.Empty).Contains(r.LastName, StringComparison.InvariantCultureIgnoreCase));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchLastNameSubstring());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchDepartureLocalDateTimeRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting)
        .Exists<EligibilityRequest>(r => r.FlightDate == passengerOriginDestinationWeighting.DepartureLocalDateTime.Date);
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchDepartureLocalDateTime());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchArrivalLocalDateTimeRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting)
        .Exists<EligibilityRequest>(r => r.FlightDate == passengerOriginDestinationWeighting.ArrivalLocalDateTime.Date);
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchArrivalLocalDateTime());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchFuzzyDepartureLocalDateTimeRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting)
        .Exists<EligibilityRequest>(r => r.FlightDate == passengerOriginDestinationWeighting.DepartureLocalDateTime.Date.AddDays(-1) ||
          r.FlightDate == passengerOriginDestinationWeighting.DepartureLocalDateTime.Date.AddDays(1));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchFuzzyDepartureLocalDateTime());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchFuzzyArrivalLocalDateTimeRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting)
        .Exists<EligibilityRequest>(r => r.FlightDate == passengerOriginDestinationWeighting.ArrivalLocalDateTime.Date.AddDays(-1) ||
          r.FlightDate == passengerOriginDestinationWeighting.ArrivalLocalDateTime.Date.AddDays(1));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchFuzzyArrivalLocalDateTime());
    }
  }

  [Tag("Weighting")]
  public class PassengerODMatchTicketNumberRule : Rule
  {
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting)
        .Exists<EligibilityRequest>(r => Array.Exists<string>(passengerOriginDestinationWeighting.TicketNumber, t => !string.IsNullOrEmpty(r.TicketNumber) && t == r.TicketNumber));
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.MatchTicketNumber());
    }
  }

  [Tag("Weighting")]
  public class PassengerODProtectionPeriod3DayRule : Rule
  {
    private readonly DateTimeOffset effectiveDateOf3DayPassengerProtection;
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;

    public PassengerODProtectionPeriod3DayRule()
    {
      effectiveDateOf3DayPassengerProtection = new DateTimeOffset(2020, 04, 09, 0, 0, 0, new TimeSpan(0));
    }
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => od.ProtectionPeriod == 3 &&
          od.DepartureLocalDateTime.Date < effectiveDateOf3DayPassengerProtection.Date);
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.RemoveOD());
    }
  }

  [Tag("Weighting")]
  public class PassengerODProtectionPeriod14DayRule : Rule
  {
    private readonly DateTimeOffset effectiveDateOf3DayPassengerProtection;
    PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = null;

    public PassengerODProtectionPeriod14DayRule()
    {
      effectiveDateOf3DayPassengerProtection = new DateTimeOffset(2020, 04, 09, 0, 0, 0, new TimeSpan(0));
    }
    public override void Define()
    {
      When()
        .Match<PassengerOriginDestinationWeighting>(() => passengerOriginDestinationWeighting, od => od.ProtectionPeriod == 14 &&
          od.DepartureLocalDateTime.Date >= effectiveDateOf3DayPassengerProtection.Date);
      Then()
        .Do(ctx => passengerOriginDestinationWeighting.RemoveOD());
    }
  }
}
