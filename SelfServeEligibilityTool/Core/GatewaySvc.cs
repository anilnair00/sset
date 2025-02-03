using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ODE.SSET.Core.CIP;
using ODE.SSET.Core.Domain;

namespace ODE.SSET.Core
{
  public class GatewaySvc
  {
    private readonly IODSearchService _odSearchService;
    
    public GatewaySvc(IODSearchService odSearchService)
    {
      _odSearchService = odSearchService;
    }

    public async Task<PassengerProtectionResponse> SnapshotSearch(EligibilityRequest eligibilityRequest)
    {
      if (eligibilityRequest == null)
        throw new ArgumentNullException(nameof(eligibilityRequest));

      if (string.IsNullOrEmpty(eligibilityRequest.PNR) && string.IsNullOrEmpty(eligibilityRequest.TicketNumber))
        throw new ArgumentNullException($"{nameof(eligibilityRequest.PNR)}, {nameof(eligibilityRequest.TicketNumber)}", "Error: SSET0001");

      if (eligibilityRequest.FlightDate == default)
        throw new ArgumentNullException(nameof(eligibilityRequest.FlightDate), "Error: SSET0002");

      if (string.IsNullOrEmpty(eligibilityRequest.FirstName))
        throw new ArgumentNullException(nameof(eligibilityRequest.FirstName), "Error: SSET0003");

      if (string.IsNullOrEmpty(eligibilityRequest.LastName))
        throw new ArgumentNullException(nameof(eligibilityRequest.LastName), "Error: SSET0004");

      return new PassengerProtectionResponse() {
        PassengerOriginDestinationWeightings = await RetrievePassengerOriginDestination(eligibilityRequest)
      };
    }

    public async Task<List<PassengerOriginDestinationWeighting>> RetrievePassengerOriginDestination(EligibilityRequest eligibilityRequest)
    {
      var passengerOriginDestinations = new List<PassengerOriginDestinationWeighting>();
      if (!string.IsNullOrEmpty(eligibilityRequest.PNR))
      {
        var results =
          (await _odSearchService.SearchAsync(pnr: eligibilityRequest.PNR))
            .ToList();

        passengerOriginDestinations.Add(new PassengerOriginDestinationWeighting()
        {
          OriginDestinationCorrelationId = new Guid("920974A3-D679-EA11-A94C-281878F6AB95"),
          PNR = "LP3OFR",
          PNRCreationDateTime = new DateTimeOffset(2020, 04, 04, 09, 21, 0, new TimeSpan(0)),
          TicketNumber = new string[] { "0142130112351" },
          DepartureAirport = "YYZ",
          ArrivalAirport = "YYT",
          DepartureDateTime = new DateTimeOffset(2020, 04, 05, 12, 30, 0, new TimeSpan(0)),
          DepartureLocalDateTime = new DateTimeOffset(2020, 04, 05, 08, 30, 0, new TimeSpan(0)),
          ArrivalLocalDateTime = new DateTimeOffset(2020, 04, 05, 13, 0, 0, new TimeSpan(0)),
          MarketingAirlineCode = "AC",
          MarketingFlightNumber = "692",
          AirlineCode = "AC",
          FlightNumber = "692",
          FirstName = "LAIPINGFILONA",
          LastName = "LEE",
          DocumentFirstName = "LAIPINGFILONA",
          DocumentLastName = "LEE",
          ProtectionPeriod = 3,
          IsDepartureLocalDateTimeMatch = true,
          //IsFlightDateMatch = true,
          IsDepartureLocalDateTimeFuzzyMatch = true,
          IsFirstNameMatch = true,
          IsLastNameMatch = true,
          IsFirstNameSubstringMatch = true,
          IsInverseFirstNameMatch = false,
          //Weight = false,
        });
      }

      if (!string.IsNullOrEmpty(eligibilityRequest.TicketNumber))
      {
        // Search by Ticket #
      }

      return passengerOriginDestinations;
    }
  }
}
