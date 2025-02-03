using System;

namespace ODE.SSET.Core.Domain
{
  public class AssessmentRequest
  {
    public string Airline { get; set; }
    public string FlightNumber { get; set; }
    public int? OperatingAirlineFlightNumber { get; set; }
    public DateTimeOffset DepartureDate { get; set; }
    public string DepartureAirport { get; set; }
    public string ArrivalAirport { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PNR { get; set; }
    public string TicketNumber { get; set; }
    public string ClaimDate { get; set; }
    public Guid? DynamicsCaseId { get; set; }
    public string DynamicsCaseNumber { get; set; }
    public int? SnapshotAdvanceDays { get; set; }
  }
}