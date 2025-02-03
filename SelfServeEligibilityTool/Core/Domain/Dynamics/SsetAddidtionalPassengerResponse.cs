using ODE.SSET.Interfaces.Dynamics;
using System;

namespace ODE.SSET.Core.Domain.Dynamics
{
  public  class SsetAddidtionalPassengerResponse : ISsetAddidtionalPassengerResponse
  {
    public Guid? DynamcisExpenseAdditionalPassengerWebRequestId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string TicketNumber { get; set; }

    public bool IsSuccessful { get; set; }

    public string ErrorDetails { get; set; }
  }
}
