namespace ODE.SSET.Interfaces.Dynamics
{
  public interface ISsetPassengerResponse
  {
    public bool IsPrimaryApplicant { get; set; }

    public bool IsClaimingCompensation { get; set; }

    public bool IsClaimingExpenses { get; set; }

    public string TicketNumber { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string PrimaryPhone { get; set; }

    public string Email { get; set; }

    public ISsetWebRequestResponse CompensationClaimWebRequestResponse { get; set; }

    public ISsetWebRequestResponse ExpenseClaimWebRequestResponse { get; set; }

    public ISsetExpenseResponse ExpenseResponse { get; set; }
  }
}
