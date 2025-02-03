namespace ODE.SSET.Interfaces.Enums
{
  public enum EligibilityStatus
  {
    Eligible = 10,
    NoDisruption = 20,
    NoMatch = 30,
    NotEligible = 40,
    Pending = 50,
    OutsidePeriod = 60,
    Over365 = 70,
    OtherAirlines = 80,
    OutsideAppr = 90,
    DuplicateRequest = 100,
    UnableDetermination = 110,
    IncidentEligible = 120,
    IncidentNotEligible = 130,
    IncidentPending = 140,
    EligibleSafety = 150,
    ExpenseCaseAlreadyExists = 160,
    DisruptionCaseAlreadyExists = 170,
    DisruptionAndExpenseCaseAlreadyExists = 180,
  }
}
