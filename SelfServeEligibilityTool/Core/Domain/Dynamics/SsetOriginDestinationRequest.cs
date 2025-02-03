namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces.Dynamics;
  using System;
  using System.Collections.Generic;

  public class SsetOriginDestinationRequest : ISsetOriginDestinationRequest
  {
    public Guid? DynamicsWebRequestId { get; set; }

    public Guid? AssessmentId { get; set; }

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
