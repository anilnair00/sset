using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Core.Domain;
using ODE.SSET.Core.Domain.SelfAssessment;

namespace ODE.SSET.Core.CIP
{
  public class FlightDisruptionService : IFlightDisruptionService
  {
    private readonly IClaimsProcessingClient _claimsProcessingClient;
    private readonly FlightDisruptionResultMapper _flightDisruptionResultMapper;

    public FlightDisruptionService(IClaimsProcessingClient claimsProcessingClient, FlightDisruptionResultMapper flightDisruptionResultMapper)
    {
      _claimsProcessingClient = claimsProcessingClient;
      _flightDisruptionResultMapper = flightDisruptionResultMapper;
    }

    public async Task<(EligibilityResponse, Guid?)> RunFlightDisruptionClaimAsync(Collection<AssessmentRequest> assessmentRequests, ItineraryBaseModel itineraryBaseModel, bool dynamicApiCall = false)
    {
      List<Task<FlightDisruptionResult>> tasks = new List<Task<FlightDisruptionResult>>();

      foreach (var assessmentRequest in assessmentRequests)
      {
        tasks.Add(GetFlightDisruptionClaimAsync(assessmentRequest));
      }

      var results = await Task.WhenAll<FlightDisruptionResult>(tasks);
      if (!dynamicApiCall)
      {
        return _flightDisruptionResultMapper.ToEligibilityResponse(results.ToList(), dynamicApiCall);
      };
      
      MapPassengerLoyalityAccount(itineraryBaseModel, results.ToList());

      return _flightDisruptionResultMapper.ToEligibilityResponse(results.ToList(), dynamicApiCall);
    }

    private async Task<FlightDisruptionResult> GetFlightDisruptionClaimAsync(AssessmentRequest assessmentRequest)
    {
      FlightDisruptionResult result = await _claimsProcessingClient.GetFlightDisruptionClaimAsync(
          assessmentRequest.Airline,
          int.Parse(assessmentRequest.FlightNumber),
          assessmentRequest.OperatingAirlineFlightNumber,
          assessmentRequest.DepartureDate,
          assessmentRequest.DepartureAirport,
          assessmentRequest.ArrivalAirport,
          assessmentRequest.FirstName,
          assessmentRequest.LastName,
          assessmentRequest.PNR,
          assessmentRequest.TicketNumber,
          assessmentRequest.ClaimDate,
          null,
          null,
          assessmentRequest.SnapshotAdvanceDays,
          null,
          null,
          null);

      return result;
    }

    private void MapPassengerLoyalityAccount(ItineraryBaseModel itineraryBaseModel, IEnumerable<FlightDisruptionResult> result)
    {
      if (result.Any() && result.FirstOrDefault().SnapshotItinerary.Passengers.Any() && result.FirstOrDefault().SnapshotItinerary.Passengers.FirstOrDefault().LoyaltyAccounts.Any() && itineraryBaseModel.Passenger != null)
      {
        itineraryBaseModel.Passenger.aeroPlanNumber = result.FirstOrDefault().SnapshotItinerary.Passengers.FirstOrDefault().LoyaltyAccounts.FirstOrDefault().AccountNumber;
        itineraryBaseModel.Passenger.acStarAllianceTierDynamicsId = result.FirstOrDefault().SnapshotItinerary.Passengers.FirstOrDefault().LoyaltyAccounts.FirstOrDefault().AcStarAllianceTierDynamicsId;
        itineraryBaseModel.Passenger.acStarAllianceTierDescription = result.FirstOrDefault().SnapshotItinerary.Passengers.FirstOrDefault().LoyaltyAccounts.FirstOrDefault().AcStarAllianceTierDescription;
      }
    }
  }
}