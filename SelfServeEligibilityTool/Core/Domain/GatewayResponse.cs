using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core.Domain
{
  public class GatewayResponse
  {
    public GatewayRequest GatewayRequest { get; set; }
    public string ExceptionMessage { get; set; }
    public EligibilityResponse EligibilityResponse { get; set; }
    public PassengerProtectionResponse PassengerProtectionResponse { get; set; }
  }
}
