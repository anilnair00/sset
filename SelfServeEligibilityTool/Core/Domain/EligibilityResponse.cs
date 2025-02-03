using System;
using System.Collections.Generic;
using System.Text;
using ODE.SSET.Interfaces;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain
{
  public class EligibilityResponse : IEligibilityResponse
  {
    public EligibilityStatus StatusCode { get; set; }
    public string StatusDescription { get; set; }
    public int? DisruptionCode { get; set; }
    public string MostSignificantLegId { get; set; }
    public int? ArrivalDelayIATACode { get; set; }
    public string SecondaryCancellationReasonCode { get; set; }
    public string OriginalDynamicCaseNumber { get; set ; }
    public bool AddClaimButtonEnabled { get; set; } = false;
    public Guid? AssessmentId { get; set; }
    public bool IsExpenseButtonEnabled { get; set; } = false;
    public string ExpenseStatusDescription { get; set; }
    public bool HasEuRegulation{ get; set; } = false;
  }
}
