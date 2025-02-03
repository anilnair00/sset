using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ODE.SSET.Core.BRE;
using ODE.SSET.Core.CIP;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Extensions;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core
{
  public class OriginDestinationService
  {
    private readonly RuleEngine ruleEngine;
    private readonly IODSearchService oDSearchService;

    public OriginDestinationService(IODSearchService injectedODSearchService, RuleEngine injectedRuleEngine)
    {
      oDSearchService = injectedODSearchService;
      ruleEngine = injectedRuleEngine;
    }

    public async Task<PassengerProtectionResponse> InspectAsync(EligibilityRequest eligibilityRequest)
    {
      Debug.WriteLine("SSET: Snapshot Search.");
      InputValidation(eligibilityRequest);

      List<PassengerOriginDestination> passengerOriginDestinations = await RetrieveODs(eligibilityRequest);
      List<PassengerOriginDestinationWeighting> passengerOriginDestinationWeightingList = ApplyBusinessRules(eligibilityRequest, passengerOriginDestinations);
      return InitializeResponse(passengerOriginDestinationWeightingList);
    }

    public async Task<(ItineraryBaseModel, PassengerProtectionResponse)> InspectAsyncByTicketNumber(EligibilityRequest eligibilityRequest)
    {
      PassengerProtectionResponse result = null;
      Debug.WriteLine("SSET: Snapshot Search for dynamics call.");
      InputBaseValidation(eligibilityRequest);
      ItineraryBaseModel itineraryBaseModel = await RetrieveODsByTicketNumber(eligibilityRequest);
      if (itineraryBaseModel.ErrorCode == null)
      {
        eligibilityRequest.FirstName = itineraryBaseModel.Passenger.FirstName;
        eligibilityRequest.FlightDate = itineraryBaseModel.OriginDestination.FirstOrDefault().Flights.FirstOrDefault().ScheduledDepartureDate ?? DateTimeOffset.Now;
        eligibilityRequest.PNR = itineraryBaseModel.PNRNumber;
        List<PassengerOriginDestination> passengerOriginDestinations = MapToBusinessRules(itineraryBaseModel, eligibilityRequest.TicketNumber);
        List<PassengerOriginDestinationWeighting> passengerOriginDestinationWeightingList = ApplyBusinessRules(eligibilityRequest, passengerOriginDestinations);
        result = InitializeResponse(passengerOriginDestinationWeightingList);
      }
      return (itineraryBaseModel, result);
    }

    private void InputValidation(EligibilityRequest eligibilityRequest)
    {
      if (eligibilityRequest == null)
        throw new ArgumentNullException(nameof(eligibilityRequest));

      InputBaseValidation(eligibilityRequest);

      if (eligibilityRequest.FlightDate == default)
        throw new ArgumentNullException(nameof(eligibilityRequest.FlightDate), "Error: SSET0002");

      if (string.IsNullOrEmpty(eligibilityRequest.FirstName))
        throw new ArgumentNullException(nameof(eligibilityRequest.FirstName), "Error: SSET0003");

      if (!string.IsNullOrEmpty(eligibilityRequest.PNR) && !string.IsNullOrEmpty(eligibilityRequest.TicketNumber))
        throw new ArgumentNullException($"{nameof(eligibilityRequest.PNR)}, {nameof(eligibilityRequest.TicketNumber)}", "Error: SSET0005");
    }

    private void InputBaseValidation(EligibilityRequest eligibilityRequest)
    {
      if (eligibilityRequest == null)
        throw new ArgumentNullException(nameof(eligibilityRequest));

      if (string.IsNullOrEmpty(eligibilityRequest.PNR) && string.IsNullOrEmpty(eligibilityRequest.TicketNumber))
        throw new ArgumentNullException($"{nameof(eligibilityRequest.PNR)}, {nameof(eligibilityRequest.TicketNumber)}", "Error: SSET0001");

      if (string.IsNullOrEmpty(eligibilityRequest.LastName))
        throw new ArgumentNullException(nameof(eligibilityRequest.LastName), "Error: SSET0004");
    }

    private async Task<List<PassengerOriginDestination>> RetrieveODs(EligibilityRequest eligibilityRequest)
    {
      IEnumerable<PassengerOriginDestination> passengerOriginDestinations;
      List<PassengerOriginDestination> passengerOriginDestinationList;

      if (string.IsNullOrEmpty(eligibilityRequest.PNR))
      {
        passengerOriginDestinations = await oDSearchService.SearchAsync(null, eligibilityRequest.TicketNumber);
      }
      else
      {
        passengerOriginDestinations = await oDSearchService.SearchAsync(eligibilityRequest.PNR, null);
      }

      passengerOriginDestinationList = passengerOriginDestinations.ToList();

      return passengerOriginDestinationList;
    }

    private async Task<ItineraryBaseModel> RetrieveODsByTicketNumber(EligibilityRequest eligibilityRequest)
    {
      ItineraryBaseModel itineraryBaseModel;
      itineraryBaseModel = await oDSearchService.OriginDestinationSearchAsync(eligibilityRequest.TicketNumber, eligibilityRequest.LastName);
      return itineraryBaseModel;
    }

    private List<PassengerOriginDestinationWeighting> ApplyBusinessRules(EligibilityRequest eligibilityRequest, List<PassengerOriginDestination> passengerOriginDestinationList)
    {
      eligibilityRequest.FirstName = eligibilityRequest.FirstName.RemoveDiacritics().RemoveNonAlphaNumericCharacters().Replace(" ", string.Empty);
      eligibilityRequest.LastName = eligibilityRequest.LastName.RemoveDiacritics().RemoveNonAlphaNumericCharacters().Replace(" ", string.Empty);
      ruleEngine.WeightingSession.Insert(eligibilityRequest);
      
      List<PassengerOriginDestinationWeighting> passengerOriginDestinationWeightingList = new List<PassengerOriginDestinationWeighting>();

      var config = new MapperConfiguration(cfg => {
        cfg.CreateMap<PassengerOriginDestination, PassengerOriginDestinationWeighting>();
      });

      IMapper mapper = config.CreateMapper();

      foreach (PassengerOriginDestination passengerOriginDestination in passengerOriginDestinationList)
      {
        PassengerOriginDestinationWeighting passengerOriginDestinationWeighting = mapper.Map<PassengerOriginDestination, PassengerOriginDestinationWeighting>(passengerOriginDestination);
        passengerOriginDestinationWeightingList.Add(passengerOriginDestinationWeighting);
      }

      foreach (PassengerOriginDestinationWeighting passengerOriginDestinationWeighting in passengerOriginDestinationWeightingList)
      {
        //Insert facts into rules engine's memory
        ruleEngine.WeightingSession.Insert(passengerOriginDestinationWeighting);
      }

      //Start match/resolve/act cycle
      ruleEngine.WeightingSession.Fire();

      return passengerOriginDestinationWeightingList;
    }

    private PassengerProtectionResponse InitializeResponse(List<PassengerOriginDestinationWeighting> passengerOriginDestinationWeightingList)
    {
      PassengerProtectionResponse passengerProtectionResponse = new PassengerProtectionResponse();
      passengerProtectionResponse.PassengerOriginDestinationWeightings = passengerOriginDestinationWeightingList;
      return passengerProtectionResponse;
    }

    private List<PassengerOriginDestination> MapToBusinessRules(ItineraryBaseModel itineraryBaseModel, string ticketNumber)
    {
      List<PassengerOriginDestination> passengerOriginDestination = new List<PassengerOriginDestination>();

      foreach (var itinerary in itineraryBaseModel.OriginDestination)
      {
        var flight = itinerary.Flights.FirstOrDefault();
        if (flight != null)
        {
          passengerOriginDestination.Add(new PassengerOriginDestination
          {
            FirstName = itineraryBaseModel.Passenger.FirstName,
            LastName = itineraryBaseModel.Passenger.LastName,
            PNR = itineraryBaseModel.PNRNumber,
            AirlineCode = flight.AirlineCarrierCode,
            MarketingAirlineCode = flight.AirlineCarrierCode,
            FlightNumber = flight.FlightNumber.ToString(),
            MarketingFlightNumber = flight.FlightNumber.ToString(),
            DepartureAirport = flight.ScheduledDepartureAirport,
            DepartureLocalDateTime = flight.ScheduledDepartureDate ?? DateTimeOffset.Now,
            ArrivalAirport = flight.ScheduledArrivalAirport,
            ArrivalLocalDateTime = flight.ScheduledArrivalDate ?? DateTimeOffset.Now,
            TicketNumber = (!string.IsNullOrEmpty(ticketNumber) ? new string[] { ticketNumber } : null),
            ProtectionPeriod = itinerary.ProtectionPeriod ?? 14
          });
        }
      }
      return passengerOriginDestination;
    }
  }
}
