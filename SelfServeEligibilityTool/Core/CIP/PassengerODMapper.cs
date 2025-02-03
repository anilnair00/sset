using System;
using System.Collections.Generic;
using System.Linq;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.CIP
{
  public class PassengerODMapper
  {
    public IEnumerable<PassengerOriginDestination> ToPassengerOriginDestination(ItineraryModel itineraryModel)
    {

      ValidateitineraryModel(itineraryModel);

      var segments = itineraryModel.Segments.ToDictionary(s => s.Id);

      var segmentIdToOdMap =
        itineraryModel
          .OriginDestinations
            .SelectMany(od => od.SegmentIds, (od, s) => (SegmentId: s, Od: od))
            .ToDictionary(pair => pair.SegmentId, pair => pair.Od);

      foreach (var od in itineraryModel.OriginDestinations)
      {
        var firstOdSegment = segments[od.SegmentIds.First()];
        var lastOdSegment = segments[od.SegmentIds.Last()];

        foreach (var passenger in itineraryModel.Passengers)
        {
          var passengerIsInOd = passenger.Segments.Any(s => segmentIdToOdMap.ContainsKey(s.SegmentId) && segmentIdToOdMap[s.SegmentId].Id == od.Id);

          if (passengerIsInOd)
          {
            yield return new PassengerOriginDestination()
            {
              OriginDestinationCorrelationId = Guid.Parse(od.Id),

              PNR = itineraryModel.PnrNumber,
              PNRCreationDateTime = itineraryModel.PnrCreationDate.Value,
              TicketNumber =
                passenger
                  .Segments
                    .Where(s => segmentIdToOdMap.ContainsKey(s.SegmentId) && segmentIdToOdMap[s.SegmentId].Id == od.Id)
                    .Select(s => s.TicketNumber)
                    .Distinct()
                    .ToArray(),

              ProtectionPeriod = od.SnapshotAdvanceDays.Value,
              PassengerOriginDestinationCorrelationId = Guid.Parse(passenger.Id),
              FirstName = passenger.FirstName,
              LastName = passenger.LastName,

              MarketingAirlineCode = firstOdSegment.AirlineCarrierCode,
              MarketingFlightNumber = firstOdSegment.FlightNumber.Value.ToString(),
              AirlineCode = firstOdSegment.OperatingAirlineCarrierCode,
              FlightNumber = firstOdSegment.OperatingAirlineFlightNumber.Value.ToString(),
              DepartureAirport = firstOdSegment.ScheduledDepartureAirport,
              DepartureLocalDateTime = firstOdSegment.ScheduledDepartureDateTime.GetValueOrDefault(),
              ArrivalAirport = lastOdSegment.ScheduledArrivalAirport,
              ArrivalLocalDateTime = lastOdSegment.ScheduledArrivalDateTime.GetValueOrDefault()
            };
          }
        }
      }

      yield break;
    }

    public ItineraryBaseModel MapPassengers(IEnumerable<ItineraryModel> itineraryModels, string primaryTicketNumber)
    {
      var itineraryBaseModel = new ItineraryBaseModel();
      itineraryBaseModel.OriginDestination = new List<ItineraryPassengerODModel>();

      if (!itineraryModels.Any())
      {
        itineraryBaseModel.ErrorCode = (int) EligibilityStatus.NoMatch;
        itineraryBaseModel.ErrorMessage = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString());
        return itineraryBaseModel;
      }

      var firstPassengerInfo = itineraryModels.FirstOrDefault();

      itineraryBaseModel.PNRNumber = firstPassengerInfo.PnrNumber;
      itineraryBaseModel.Passenger = new ItineraryPassengerModel
      {
        FirstName = firstPassengerInfo.Passengers.FirstOrDefault().FirstName,
        LastName = firstPassengerInfo.Passengers.FirstOrDefault().LastName,
        IsPrimaryApplicant = true,
        TicketNumber = primaryTicketNumber
      };

      //when additional passengers are less than or equal 4 only then return additional passenger
      if (firstPassengerInfo.AdditionalPassengers.Count <= 4)
      {
        itineraryBaseModel.AdditionalPassengers = (from s in firstPassengerInfo.AdditionalPassengers
                                                   select new ItineraryPassengerModel
                                                   {
                                                     FirstName = s.PassengerFirstName,
                                                     LastName = s.PassengerLastName,
                                                     IsPrimaryApplicant = (bool)s.IsPrimaryApplicant,
                                                     TicketNumber = s.TicketNumber
                                                   }).ToList();
      }

      return MapOriginDestination(itineraryModels, itineraryBaseModel);
    }

    private ItineraryBaseModel MapOriginDestination(IEnumerable<ItineraryModel> itineraryModels, ItineraryBaseModel itineraryBaseModel)
    {
      foreach (var itineraryModel in itineraryModels)
      {
        var itineraryPassengerODModel = new ItineraryPassengerODModel();
        itineraryPassengerODModel.AddClaimButtonEnabled = true;
        itineraryPassengerODModel.Flights = (MapPassengerOriginDestination(itineraryModel.Segments));
        itineraryPassengerODModel.ProtectionPeriod = itineraryModel.OriginDestinations.FirstOrDefault().SnapshotAdvanceDays;
        itineraryBaseModel.OriginDestination.Add(itineraryPassengerODModel);
      }
      return itineraryBaseModel;
    }

    private List<ItineraryPassengerSegmentModel> MapPassengerOriginDestination(ICollection<SegmentModel> segmentModel)
    {
      List<ItineraryPassengerSegmentModel> baseSegmentModels = new List<ItineraryPassengerSegmentModel>();

      foreach(var segment in segmentModel)
      {
        baseSegmentModels.Add(
          new ItineraryPassengerSegmentModel
          {
            AirlineCarrierCode = segment.AirlineCarrierCode,
            FlightNumber = segment.FlightNumber,
            ScheduledDepartureAirport = segment.ScheduledDepartureAirport,
            ScheduledDepartureDate = segment.ScheduledDepartureDateTime.Value.Date,
            ScheduledDepartureTime = segment.ScheduledDepartureDateTime.Value.TimeOfDay,
            ScheduledArrivalAirport = segment.ScheduledArrivalAirport,
            ScheduledArrivalDate = segment.ScheduledArrivalDateTime.Value.Date,
            ScheduledArrivalTime = segment.ScheduledArrivalDateTime.Value.TimeOfDay,
            ScheduledArrivalAirportCityName = segment.ScheduledArrivalAirportCityName,
            ScheduledDepartureAirportCityName = segment.ScheduledDepartureAirportCityName,
          }
        );
      }
      return baseSegmentModels;
    }

    private void ValidateitineraryModel(ItineraryModel itineraryModel)
    {
      if (itineraryModel == null)
        throw new ArgumentNullException(nameof(itineraryModel));

      if (itineraryModel.OriginDestinations == null)
        throw new ArgumentNullException(nameof(itineraryModel.OriginDestinations));

      if (itineraryModel.Passengers == null)
        throw new ArgumentNullException(nameof(itineraryModel.Passengers));

      if (itineraryModel.Segments == null)
        throw new ArgumentNullException(nameof(itineraryModel.Segments));

      if (itineraryModel.OriginDestinations.Any(s => string.IsNullOrEmpty(s.Id)))
        throw new ArgumentNullException($"{nameof(itineraryModel)}.{nameof(itineraryModel.OriginDestinations)}.Id");

      if (itineraryModel.Passengers.Any(s => string.IsNullOrEmpty(s.Id)))
        throw new ArgumentNullException($"{nameof(itineraryModel)}.{nameof(itineraryModel.Passengers)}.Id");

      if (itineraryModel.Segments.Any(s => string.IsNullOrEmpty(s.Id)))
        throw new ArgumentNullException($"{nameof(itineraryModel)}.{nameof(itineraryModel.Segments)}.Id");
    }
  }
}
