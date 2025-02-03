using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace ODE.SSET.Core.Domain.SelfAssessment
{
  public class ItineraryPassengerODModel
  {

    [JsonIgnore]
    public int? ProtectionPeriod { get; set; }
    public int MatchAndClaimEligibilityCode { get; set; }
    public string MatchAndClaimEligibility { get; set; }
    public int? ArrivalDelayIATACode { get; set; }
    public string SecondaryCancellationReasonCode { get; set; }
    public string OriginalDynamicCaseNumber { get; set; }
    public bool AddClaimButtonEnabled { get; set; }
    public bool IsExpenseButtonEnabled { get; set; }
    public string ExpenseEligibility { get; set; }
    public Guid? AssessmentId { get; set; }
    public bool HasEURegulation { get; set; }
    public List<ItineraryPassengerSegmentModel> Flights { get; set; }
  }
}
