using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using ODE.SSET.Core.CIP;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;
using ODE.SSET.Interfaces.Enums;
using System.Collections.Generic;

namespace ODE.SSET.Core
{
  public class AssessmentService
  {
    private readonly IFlightDisruptionService _flightDisruptionService;

    public AssessmentService(IFlightDisruptionService flightDisruptionService)
    {
      _flightDisruptionService = flightDisruptionService;
    }

    public async Task<(EligibilityResponse, Guid?)> RunAssessmentAsync(PassengerProtectionResponse passengerProtectionResponse)
    {
      if (passengerProtectionResponse.PassengerOriginDestinationWeightings.Count == 0 ||
          passengerProtectionResponse.PassengerOriginDestinationWeightings.Max(p => p.Weight) == 0)
      {
        return (
          new EligibilityResponse()
          {
            StatusCode = Interfaces.Enums.EligibilityStatus.NoMatch,
            StatusDescription = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString())
          },
          null);
      }

      Debug.WriteLine("SSET: Run Flight Disruption Assessment.");
      //InputValidation(assessmentRequest); ?
      var assessmentRequests = BuildAssessmentRequests(passengerProtectionResponse);
      if (assessmentRequests.Count == 0)
      {
        return (
          new EligibilityResponse()
          {
            StatusCode = EligibilityStatus.NoMatch,
            StatusDescription = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString())
          },
          null);
      }

      return await _flightDisruptionService.RunFlightDisruptionClaimAsync(assessmentRequests, null, false);
    }

    public async Task<ItineraryBaseModel> RunSelfAssessmentAsync(ItineraryBaseModel itineraryBaseModel, PassengerProtectionResponse passengerProtectionResponse)
    {
      EligibilityResponse eligibilityResponse;
      Guid? guid;
      int i = 0;
      foreach (var passenger in passengerProtectionResponse.PassengerOriginDestinationWeightings)
      {
        (eligibilityResponse, guid) = await RunSelfAssessmentAsync(passenger, itineraryBaseModel);

        if (itineraryBaseModel.OriginDestination != null && itineraryBaseModel.OriginDestination.Count > 0)
        {
          var itineraryPassengerOD = itineraryBaseModel.OriginDestination.Skip(i).Take(1);
          itineraryPassengerOD.FirstOrDefault().MatchAndClaimEligibilityCode = (int)eligibilityResponse.DisruptionCode;
          itineraryPassengerOD.FirstOrDefault().MatchAndClaimEligibility = eligibilityResponse.StatusDescription;
          itineraryPassengerOD.FirstOrDefault().AddClaimButtonEnabled = eligibilityResponse.AddClaimButtonEnabled;
          itineraryPassengerOD.FirstOrDefault().ArrivalDelayIATACode = eligibilityResponse.ArrivalDelayIATACode;
          itineraryPassengerOD.FirstOrDefault().SecondaryCancellationReasonCode = eligibilityResponse.SecondaryCancellationReasonCode;
          itineraryPassengerOD.FirstOrDefault().OriginalDynamicCaseNumber = eligibilityResponse.OriginalDynamicCaseNumber;
          itineraryPassengerOD.FirstOrDefault().AssessmentId = eligibilityResponse.AssessmentId;
          itineraryPassengerOD.FirstOrDefault().IsExpenseButtonEnabled = eligibilityResponse.IsExpenseButtonEnabled;
          itineraryPassengerOD.FirstOrDefault().ExpenseEligibility = eligibilityResponse.ExpenseStatusDescription;
          itineraryPassengerOD.FirstOrDefault().HasEURegulation = eligibilityResponse.HasEuRegulation;
        }
        if (eligibilityResponse.StatusDescription.ToUpper() == "NOMATCH")
        {
          itineraryBaseModel.ErrorCode = (int)EligibilityStatus.NoMatch;
          itineraryBaseModel.ErrorMessage = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString());
          itineraryBaseModel.AdditionalPassengers = new List<ItineraryPassengerModel>();
          itineraryBaseModel.OriginDestination = new List<ItineraryPassengerODModel>();
          itineraryBaseModel.Passenger = null;
        }

        i = i+1;
      }
      return itineraryBaseModel;
    }

    private Collection<AssessmentRequest> BuildAssessmentRequests(PassengerProtectionResponse passengerProtectionResponse)
    {
      Debug.WriteLine("SSET: Build Assessment Request.");

      // Find highest weight
      var maxWeight = passengerProtectionResponse.PassengerOriginDestinationWeightings.Max(p => p.Weight);

      // Find all passengers for the max weight
      var maxPassengers = passengerProtectionResponse.PassengerOriginDestinationWeightings.Where(p => p.Weight == maxWeight);

      var assessmentRequests = new Collection<AssessmentRequest>();
      foreach (var passenger in maxPassengers)
      {
        // Skip assessment request if all name related matching BR are false
        if (!passenger.IsFirstNameMatch && !passenger.IsLastNameMatch &&
          !passenger.IsInverseFirstNameMatch && !passenger.IsInverseLastNameMatch &&
          !passenger.IsFirstNameSubstringMatch && !passenger.IsLastNameSubstringMatch)
        {
          continue;
        }

        // Skip assessment request if all flight date related matching BR are false
        if (!passenger.IsDepartureLocalDateTimeMatch && !passenger.IsArrivalLocalDateTimeMatch &&
          !passenger.IsDepartureLocalDateTimeFuzzyMatch && !passenger.IsArrivalLocalDateTimeFuzzyMatch)
        {
          continue;
        }

        // Skip assessment if a mandatory parameter is missing (for FD API)
        if (string.IsNullOrEmpty(passenger.AirlineCode) ||
            string.IsNullOrEmpty(passenger.FlightNumber) ||
            string.IsNullOrEmpty(passenger.DepartureAirport) ||
            string.IsNullOrEmpty(passenger.ArrivalAirport) ||
            string.IsNullOrEmpty(passenger.FirstName) ||
            string.IsNullOrEmpty(passenger.LastName))
        {
          continue;
        }

        assessmentRequests.Add(ToAssessmentRequest(passenger));
      }

      return assessmentRequests;
    }

    private AssessmentRequest ToAssessmentRequest(PassengerOriginDestinationWeighting passengerOriginDestinationWeighting)
      => new AssessmentRequest
      {
        Airline = passengerOriginDestinationWeighting.AirlineCode.Trim(),
        FlightNumber = passengerOriginDestinationWeighting.FlightNumber,
        DepartureDate = passengerOriginDestinationWeighting.DepartureLocalDateTime,
        DepartureAirport = passengerOriginDestinationWeighting.DepartureAirport,
        ArrivalAirport = passengerOriginDestinationWeighting.ArrivalAirport,
        FirstName = passengerOriginDestinationWeighting.FirstName,
        LastName = passengerOriginDestinationWeighting.LastName,
        PNR = passengerOriginDestinationWeighting.PNR,
        TicketNumber = passengerOriginDestinationWeighting.TicketNumber.FirstOrDefault(),
        SnapshotAdvanceDays = passengerOriginDestinationWeighting.ProtectionPeriod,
        ClaimDate =DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)
      };

    private async Task<(EligibilityResponse, Guid?)> RunSelfAssessmentAsync(PassengerOriginDestinationWeighting passengerProtectionResponse, ItineraryBaseModel itineraryBaseModel)
    {
      if (passengerProtectionResponse.Weight == 0)
      {
        return (
          new EligibilityResponse()
          {
            StatusCode = Interfaces.Enums.EligibilityStatus.NoMatch,
            StatusDescription = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString())
          },
          null);
      }

      Debug.WriteLine("SSET: Run Flight Disruption Assessment.");
      //InputValidation(assessmentRequest); ?
      var assessmentRequests = BuildSelfAssessmentRequests(passengerProtectionResponse);
      if (assessmentRequests.Count == 0)
      {
        return (
          new EligibilityResponse()
          {
            StatusCode = Interfaces.Enums.EligibilityStatus.NoMatch,
            StatusDescription = FlightDisruptionResultMapper.ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString())
          },
          null);
      }

      return await _flightDisruptionService.RunFlightDisruptionClaimAsync(assessmentRequests, itineraryBaseModel, true);
    }

    private Collection<AssessmentRequest> BuildSelfAssessmentRequests(PassengerOriginDestinationWeighting passenger)
    {
      Debug.WriteLine("SSET: Build Assessment Request.");
      
      var assessmentRequests = new Collection<AssessmentRequest>();
      assessmentRequests.Add(ToAssessmentRequest(passenger));

      return assessmentRequests;
    }
  }
}
 