using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core.CIP
{
  public class ODSearchService : IODSearchService
  {
    private readonly IItinerariesClient itinerariesClient;
    private readonly PassengerODMapper passengerODMapper;
    private readonly ISsetOperationsClient ssetOperationsClient;

    public ODSearchService(IItinerariesClient itinerariesClient, PassengerODMapper passengerODMapper, ISsetOperationsClient ssetOperationsClient)
    {
      this.itinerariesClient = itinerariesClient;
      this.ssetOperationsClient = ssetOperationsClient;
      this.passengerODMapper = passengerODMapper;
    }

    public async Task<IEnumerable<PassengerOriginDestination>> SearchAsync(string pnr, string ticketNumber)
    {
      if ((string.IsNullOrEmpty(pnr) && string.IsNullOrEmpty(ticketNumber)) ||
          (!string.IsNullOrEmpty(pnr) && !string.IsNullOrEmpty(ticketNumber)))
      {
        throw new ArgumentException("A PNR or a TicketNumber is required.");
      }

        return
          (await itinerariesClient.SearchAppraisalItinerariesAsync(
            pnrNumber: pnr,
            pnrCreationDate: null,
            ticketNumber: ticketNumber,
            snapshotAdvanceDays: null,
            passengerFirstName: null,
            passengerLastName: null,
            passengerLoyaltyAccountNumber: null,
            scheduledDepartureDateStart: null,
            scheduledDepartureDateEnd: null,
            x_SessionId: null,
            x_DeviceId: null))
              .Items
              .SelectMany(passengerODMapper.ToPassengerOriginDestination);
    }

    public async Task<ItineraryBaseModel> OriginDestinationSearchAsync(string ticketNumber, string lastName)
    {
      var result = await ssetOperationsClient.SearchOriginDestinationAsync(
        ticketNumber: ticketNumber,
        lastName: lastName,
        x_SessionId: null,
        x_DeviceId: null);

      return passengerODMapper.MapPassengers(result.Items, ticketNumber);
    }
  }
}
