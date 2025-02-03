using ODE.SSET.Interfaces.Dynamics;

namespace ODE.SSET.Core.Domain.Dynamics
{
  public class SsetPassengerRequest : ISsetPassengerRequest
  {
    public bool IsPrimaryApplicant { get; set; }
    public long TitleDynamicsId { get; set; }
    public long CountryDynamicsId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string AddressStreet { get; set; }
    public bool IsAddressSameAsPrimaryApplicant { get; set; }
    public string City { get; set; }
    public string ProvinceState { get; set; }
    public string ZipCode { get; set; }
    public string PrimaryPhone { get; set; }
    public string MobilePhone { get; set; }
    public string Email { get; set; }
    public string ConfirmEmail { get; set; }
    public string AeroPlanNumber { get; set; }
    public long ACStarAllianceTierDynamicsId { get; set; }
    public bool IsClaimingCompensation { get; set; }
    public bool IsClaimingExpenses { get; set; }
    public string TicketNumber { get; set; }
  }
}
