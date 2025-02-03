using System;
using System.Collections.Generic;
using System.Text;

namespace ODE.SSET.Interfaces
{
  public interface IPassengerOriginDestination
  {
    public Guid OriginDestinationCorrelationId { get; set; }
    public Guid PassengerOriginDestinationCorrelationId { get; set; }
    public int ProtectionPeriod { get; set; }
    public string PNR { get; set; }
    public DateTimeOffset PNRCreationDateTime { get; set; }
    public string[] TicketNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string DocumentFirstName { get; set; }
    public string DocumentMiddleName { get; set; }
    public string DocumentLastName { get; set; }
    public string MarketingAirlineCode { get; set; }
    public string MarketingFlightNumber { get; set; }
    public string AirlineCode { get; set; }
    public string FlightNumber { get; set; }
    public string DepartureAirport { get; set; }
    public DateTimeOffset DepartureDateTime { get; set; }
    public DateTimeOffset DepartureLocalDateTime { get; set; }
    public string ArrivalAirport { get; set; }
    public DateTimeOffset ArrivalLocalDateTime { get; set; }
  }
}
