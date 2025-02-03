using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;
using FluentAssertions;
using ODE.SSET.Core.CIP;
using ODE.SSET.Core.Domain;
using AirCanada.ODE.CIP.APIClient;


namespace ODE.SSET.Core.Tests.CIP
{
  public class PassengerODMapperTests
  {
    private readonly PassengerODMapper passengerODMapper;

    public PassengerODMapperTests()
    {
      passengerODMapper = new PassengerODMapper();
    }

    [Fact]
    public void NullExceptionItineraryModel()
    {
      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(null).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'itineraryModel')");
    }

    [Fact]
    public void NullExceptionItineraryModelOriginDestinations()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        Passengers = new List<PassengerModel>(),
        Segments = new List<SegmentModel>()
      };
      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'OriginDestinations')");
    }

    [Fact]
    public void NullExceptionItineraryModelPassengers()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        OriginDestinations = new List<OriginDestinationModel>(),
        Segments = new List<SegmentModel>()
      };
      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'Passengers')");
    }

    [Fact]
    public void NullExceptionItineraryModelSegments()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        OriginDestinations = new List<OriginDestinationModel>(),
        Passengers = new List<PassengerModel>()
      };
      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'Segments')");
    }

    [Fact]
    public void NullExceptionItineraryModelOriginDestinationModelId()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        OriginDestinations = new List<OriginDestinationModel>(),
        Passengers = new List<PassengerModel>(),
        Segments = new List<SegmentModel>()
      };

      itineraryModel.OriginDestinations.Add(new OriginDestinationModel()
      {
        SnapshotAdvanceDays = 14
      });

      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'itineraryModel.OriginDestinations.Id')");
    }

    [Fact]
    public void NullExceptionItineraryModelSegmentModelId()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        OriginDestinations = new List<OriginDestinationModel>(),
        Passengers = new List<PassengerModel>(),
        Segments = new List<SegmentModel>()
      };

      itineraryModel.Segments.Add(new SegmentModel()
      {
        AirlineCarrierCode = "AC",
        FlightNumber = 692,
        OperatingAirlineCarrierCode = "AC",
        OperatingAirlineFlightNumber = 692,
        ScheduledDepartureAirport = "YYZ",
        ScheduledDepartureDateTime = new DateTimeOffset(2020, 04, 05, 08, 30, 0, new TimeSpan(0)),
        ScheduledArrivalAirport = "YYT",
        ScheduledArrivalDateTime = new DateTimeOffset(2020, 04, 05, 13, 0, 0, new TimeSpan(0))
      });

      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'itineraryModel.Segments.Id')");
    }

    [Fact]
    public void NullExceptionItineraryModelPassengerModelId()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        OriginDestinations = new List<OriginDestinationModel>(),
        Passengers = new List<PassengerModel>(),
        Segments = new List<SegmentModel>()
      };

      itineraryModel.Passengers.Add(new PassengerModel()
      {
        FirstName = "LAIPINGFILONA",
        LastName = "LEE",
      });

      passengerODMapper.Invoking(s => s.ToPassengerOriginDestination(itineraryModel).Any()).Should().Throw<ArgumentNullException>().WithMessage("Value cannot be null. (Parameter 'itineraryModel.Passengers.Id')");
    }

    [Fact]
    public void MapSimpleItineraryModel()
    {
      ItineraryModel itineraryModel = new ItineraryModel()
      {
        Id = 62967609,
        PnrNumber = "LP3OFR",
        PnrCreationDate = new DateTimeOffset(2020, 04, 04, 0, 0, 0, new TimeSpan(0)),
        OriginDestinations = new List<OriginDestinationModel>(),
        Passengers = new List<PassengerModel>(),
        Segments = new List<SegmentModel>(),
        //OriginDestinations = new List<OriginDestinationModel>
      };

      itineraryModel.OriginDestinations.Add(new OriginDestinationModel()
      {
        Id = "3a7ebf8c-4a78-ea11-a94c-281878f6e6c7",
        SnapshotAdvanceDays = 14,
        SegmentIds = new string[] { "39b3037a-4c78-ea11-a94c-281878f6e6c7" }
      });

      itineraryModel.Passengers.Add(new PassengerModel()
      {
        Id = "0f799c57-4c78-ea11-a94c-281878f6e6c7",
        FirstName = "LAIPINGFILONA",
        LastName = "LEE",
        Segments = new List<PassengerSegmentModel>()
      });

      itineraryModel.Passengers.First().Segments.Add(new PassengerSegmentModel() {
        SegmentId = "39b3037a-4c78-ea11-a94c-281878f6e6c7",
        TicketNumber = "0142130112351"
      });

      itineraryModel.Segments.Add(new SegmentModel()
      {
        Id = "39b3037a-4c78-ea11-a94c-281878f6e6c7",
        AirlineCarrierCode = "AC",
        FlightNumber = 692,
        OperatingAirlineCarrierCode = "AC",
        OperatingAirlineFlightNumber = 692,
        ScheduledDepartureAirport = "YYZ",
        ScheduledDepartureDateTime = new DateTimeOffset(2020, 04, 05, 08, 30, 0, new TimeSpan(0)),
        ScheduledArrivalAirport = "YYT",
        ScheduledArrivalDateTime = new DateTimeOffset(2020, 04, 05, 13, 0, 0, new TimeSpan(0))
      });

      IEnumerable<PassengerOriginDestination> passengerOriginDestinations = passengerODMapper.ToPassengerOriginDestination(itineraryModel);
      PassengerOriginDestination passengerOriginDestination = passengerOriginDestinations.FirstOrDefault();
      
      passengerOriginDestination.PNR.Should().Be("LP3OFR");
      //passengerOriginDestination.PNRCreationDateTime.Should().Be(new DateTimeOffset(2020, 04, 04, 09, 21, 0, new TimeSpan(0)));
      passengerOriginDestination.ProtectionPeriod.Should().Be(14);
      passengerOriginDestination.FirstName.Should().Be("LAIPINGFILONA");
      passengerOriginDestination.LastName.Should().Be("LEE");
      passengerOriginDestination.TicketNumber[0].Should().Be("0142130112351");
      passengerOriginDestination.MarketingAirlineCode.Should().Be("AC");
      passengerOriginDestination.MarketingFlightNumber.Should().Be("692");
      passengerOriginDestination.AirlineCode.Should().Be("AC");
      passengerOriginDestination.FlightNumber.Should().Be("692");
      passengerOriginDestination.DepartureAirport.Should().Be("YYZ");
      passengerOriginDestination.DepartureLocalDateTime.Should().Be(new DateTimeOffset(2020, 04, 05, 08, 30, 0, new TimeSpan(0)));
      passengerOriginDestination.ArrivalAirport.Should().Be("YYT");
      passengerOriginDestination.ArrivalLocalDateTime.Should().Be(new DateTimeOffset(2020, 04, 05, 13, 0, 0, new TimeSpan(0)));
    }
  }
}
