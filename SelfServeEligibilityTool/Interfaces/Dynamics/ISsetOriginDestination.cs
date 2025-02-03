namespace ODE.SSET.Interfaces.Dynamics
{
  using System;
  using System.Collections.Generic;

  public interface ISsetOriginDestination
  {
    public Guid? DynamicsWebRequestId { get; set; }

    public string FlightNumber { get; set; }

    public DateTime FlightDate { get; set; }

    public string TicketNumber { get; set; }

    public string DepartureAirportCode { get; set; }

    public string ArrivalAirportCode { get; set; }

    public string PnrNumber { get; set; }

    public bool IsClaimingCompensation { get; set; }

    public bool IsClaimingExpenses { get; set; }

    public bool IsEuRegulation { get; set; }

    public IEnumerable<ISsetExpenseRequest> Expenses { get; set; }
  }
}
