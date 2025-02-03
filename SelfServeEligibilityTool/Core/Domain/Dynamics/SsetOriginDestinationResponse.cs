namespace ODE.SSET.Core.Domain.Dynamics
{
  using ODE.SSET.Interfaces.Dynamics;
  using System;
  using System.Collections.Generic;

  public class SsetOriginDestinationResponse : ISsetOriginDestinationResponse
  {
    public string FlightNumber { get; set; }

    public DateTime FlightDate { get; set; }

    public string DepartureAirportCode { get; set; }

    public string ArrivalAirportCode { get; set; }

    public string PnrNumber { get; set; }

    public IEnumerable<ISsetPassengerResponse> Passengers { get; set; }

    public IEnumerable<ISsetAddidtionalPassengerResponse> AddidtionalPassengers { get; set; }
  }
}
