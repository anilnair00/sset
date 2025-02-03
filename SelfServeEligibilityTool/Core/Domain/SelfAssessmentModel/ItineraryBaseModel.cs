using System.Collections.Generic;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.Domain.SelfAssessment
{
  public class ItineraryBaseModel
  {
    public int? ErrorCode  { get; set; }

    public string ErrorMessage { get; set; }

    public List<ValidationException> ValidationExceptions { get; set; }

    public ItineraryPassengerModel Passenger { get; set; }

    public string PNRNumber { get; set; }

    public EligibilityStatus StatusCode { get; set; }

    public string StatusDescription { get; set; }

    public List<ItineraryPassengerODModel> OriginDestination { get; set; }
    public List<ItineraryPassengerModel> AdditionalPassengers { get; set; }
  }
}
