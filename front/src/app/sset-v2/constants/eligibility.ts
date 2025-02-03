export enum EligibilityStatus {
  DuplicateDisruption = 'disruptionCaseAlreadyExists',
  DuplicateDisruptionAndExpense = 'disruptionAndExpenseCaseAlreadyExists',
  DuplicateExpense = 'expenseCaseAlreadyExists',
  DuplicateRequest = 'duplicateRequest',
  Eligible = 'eligible',
  IncidentEligible = 'incidentEligible',
  IncidentNotEligible = 'incidentNotEligible',
  IncidentPending = 'incidentPending',
  NoDisruption = 'noDisruption',
  NoMatch = 'noMatch',
  NotEligible = 'notEligible',
  OAL = 'otherAirlines',
  OutsideAppr = 'outsideAppr',
  OutsidePeriod = 'outsidePeriod',
  Over365 = 'over365',
  Pending = 'pending',
  UnableDetermination = 'unableDetermination'
}
