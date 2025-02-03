using System;
using System.Collections.Generic;
using System.Text;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Interfaces
{
  public interface IEligibilityResponse
  {
    public EligibilityStatus StatusCode { get; set; }
    public string StatusDescription { get; set; }
    public int? DisruptionCode { get; set; }
    public string MostSignificantLegId { get; set; }
    public int? ArrivalDelayIATACode { get; set; }
    public string SecondaryCancellationReasonCode { get; set; }
    public string OriginalDynamicCaseNumber { get; set; }
  }
}
