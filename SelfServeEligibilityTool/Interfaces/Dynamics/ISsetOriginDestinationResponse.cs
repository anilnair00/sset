namespace ODE.SSET.Interfaces.Dynamics
{
  using System;
  using System.Collections.Generic;

  public interface ISsetOriginDestinationResponse
  {
    public string FlightNumber { get; set; }

    public DateTime FlightDate { get; set; }

    public string PnrNumber { get; set; }

    public string DepartureAirportCode { get; set; }

    public string ArrivalAirportCode { get; set; }

    public IEnumerable<ISsetPassengerResponse> Passengers { get; set; }

    public IEnumerable<ISsetAddidtionalPassengerResponse> AddidtionalPassengers { get; set; }
  }
}
