using System;

namespace ODE.SSET.Core.Domain.SelfAssessment
{
  public class ItineraryPassengerSegmentModel
  {
    public int? FlightNumber { get; set; }

    public DateTimeOffset? ScheduledDepartureDate { get; set; }

    public TimeSpan? ScheduledDepartureTime  { get; set; }

    public string ScheduledDepartureAirport { get; set; }
    
    public DateTimeOffset? ScheduledArrivalDate { get; set; }

    public TimeSpan? ScheduledArrivalTime { get; set; }

    public string ScheduledArrivalAirport { get; set; }

    public string ScheduledDepartureAirportCityName { get; set; }

    public string ScheduledArrivalAirportCityName { get; set; }
    
    public bool isCancelledFlight { get; set; }

    public string AirlineCarrierCode { get; set; }

    public string AirlineName { get; set; }
  }
}
