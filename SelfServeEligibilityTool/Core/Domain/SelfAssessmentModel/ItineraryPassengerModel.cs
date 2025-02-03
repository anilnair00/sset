using System.Collections.Generic;

namespace ODE.SSET.Core.Domain.SelfAssessment
{
  public class ItineraryPassengerModel
  {
    public string TicketNumber { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public bool IsPrimaryApplicant { get; set; }

    public string aeroPlanNumber { get; set; }

    public long? acStarAllianceTierDynamicsId { get; set; }

    public string acStarAllianceTierDescription { get; set; }
  }
}
