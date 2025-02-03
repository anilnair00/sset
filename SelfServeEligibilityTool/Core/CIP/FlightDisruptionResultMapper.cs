using System;
using System.Collections.Generic;
using System.Linq;
using AirCanada.ODE.CIP.APIClient;
using ODE.SSET.Core.Domain;
using ODE.SSET.Interfaces.Enums;

namespace ODE.SSET.Core.CIP
{
  public class FlightDisruptionResultMapper
  {
    public (EligibilityResponse, Guid?) ToEligibilityResponse(List<FlightDisruptionResult> models, bool dynamicApiCall)
    {
      if (models.Count == 0)
      {
        return (
          new EligibilityResponse()
          {
            StatusCode = Interfaces.Enums.EligibilityStatus.NoMatch,
            StatusDescription = ToCamelCase(Interfaces.Enums.EligibilityStatus.NoMatch.ToString())
          },
          null);
      }

      EligibilityResponse response;
      FlightDisruptionResult result;
      if (models.Count > 1)
      {
        // Multiple calls were sent to FD API. Map all FD responses into a list of EligibilityResponses.
        var eligibilityResponses = new List<(EligibilityResponse response, FlightDisruptionResult model)>();
        foreach (var model in models)
        {
          eligibilityResponses.Add((ToEligibilityResponse(model, dynamicApiCall), model));
        }

        // Find all eligible responses
        var eligibles = eligibilityResponses.Where(r => r.response.StatusCode == EligibilityStatus.Eligible).ToList();

        if (eligibles.Count == 0)
        {
          // No eligible response. Map the one with the highest delay.
          (response, result) = eligibilityResponses.OrderByDescending(e => e.model.TotalDelayInMinutes).First();
        }
        else if (eligibles.Count == 1)
        {
          // Only one eligible response. Map it.
          (response, result) = eligibles.First();
        }
        else // (eligibles.Count > 1)
        {
          // Multiple eligible responses. Map the one with the highest delay.
          (response, result) = eligibles.OrderByDescending(e => e.model.TotalDelayInMinutes).First();
        }
      }
      else
      {
        // Only one call was sent to FD API. Map the first response.
        result = models.First();
        response = ToEligibilityResponse(result, dynamicApiCall);
      }

      return (response, result.AssessmentId);
    }

    private EligibilityResponse ToEligibilityResponse(FlightDisruptionResult model, bool dynamicApiCall)
    {
      var response = new EligibilityResponse()
      {
        StatusCode = EligibilityStatus.NoMatch,
        StatusDescription = ToCamelCase(EligibilityStatus.NoMatch.ToString())
      };

      if (model.MatchAndClaimEligibility != null)
      {
        var eligibilityStatus = EligibilityStatus.NoMatch;
        var expenseEligibilityStatus = EligibilityStatus.NoMatch;
        if (!dynamicApiCall)
        {
           eligibilityStatus = ToEligibilityStatus(model.MatchAndClaimEligibility.Value);
        }
        else
        {
          var departureDateTime = model.SnapshotItinerary.Segments.FirstOrDefault().ScheduledDepartureDateTime;
            
          (eligibilityStatus, response.AddClaimButtonEnabled) =  ToSelfEligibilityStatus(model.MatchAndClaimEligibility.Value);
          (expenseEligibilityStatus, response.IsExpenseButtonEnabled) = ToSelfExpenseEligibilityStatus(model.MatchAndClaimEligibility.Value, model.HasDepartureAirportInEURegulation ?? true, model.TotalDelayInMinutes, departureDateTime, model.IsExpenseExist, model.IsSpecialCustomerExpenseEligible);
        }
        response.StatusCode = eligibilityStatus;
        response.StatusDescription = ToCamelCase(eligibilityStatus.ToString());
        response.ExpenseStatusDescription = ToCamelCase(expenseEligibilityStatus.ToString());
        response.DisruptionCode = model.MatchAndClaimEligibilityCode;
        response.OriginalDynamicCaseNumber = model.DynamicsCaseNumber != null ? model.ExpenseDynamicsCaseNumber != null ? model.DynamicsCaseNumber + "," + model.ExpenseDynamicsCaseNumber : model.DynamicsCaseNumber : model.ExpenseDynamicsCaseNumber != null ? model.ExpenseDynamicsCaseNumber : null;
        response.HasEuRegulation = model.HasDepartureAirportInEURegulation ?? false;
      }
      response.AssessmentId = model.AssessmentId;
      var mostSignificantLegId = model.ActualFlightDisruptionItineraryAnalysisResult?.MostSignificantLegId;
      response.MostSignificantLegId = mostSignificantLegId;

      var mostSignificantLegSource = model.ActualFlightDisruptionItineraryAnalysisResult?.MostSignificantLegSource;

      if (mostSignificantLegSource == FlightDisruptionMostSignificantLegSource.FlownFlights)
      {
        var mostSignificantLeg = model
          .ActualFlightDisruptionItineraryAnalysisResult?
          .ActualLegsMatchedToSnapshotOD?
          .Where(l => l.Id == mostSignificantLegId)
          .FirstOrDefault();

        if (mostSignificantLeg == null)
        {
          mostSignificantLeg = model
          .ActualFlightDisruptionItineraryAnalysisResult?
          .ActualNotBoardedLegsMatchedToSnapshotOD?
          .Where(l => l.Id == mostSignificantLegId)
          .FirstOrDefault();
        }

        response.ArrivalDelayIATACode = mostSignificantLeg?.DelayIataCode;
      }
      else if (mostSignificantLegSource == FlightDisruptionMostSignificantLegSource.CancelledFlights)
      {
        var mostSignificantLeg = model
          .ActualItinerary?
          .CancelledLegs?
          .Where(l => l.Id == mostSignificantLegId)
          .FirstOrDefault();

        response.SecondaryCancellationReasonCode = mostSignificantLeg?.SecondaryCancellationReasonCode;
      }

      return response;
    }

    private EligibilityStatus ToEligibilityStatus(FlightDisruptionMatchAndEligibilityStatus flightDisruptionMatchAndEligibilityStatus)
    {
      switch (flightDisruptionMatchAndEligibilityStatus)
      {
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllable: //10001
          return EligibilityStatus.Eligible;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalWithDelayOnFlights: //11005
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalNoDelayOnFlights: //11006
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleMinimumDelayNotReached: //11001
          return EligibilityStatus.NoDisruption;

        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //91110
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //91101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //91100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //91011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //91010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //91001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //91000
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxFound: //90111
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //90110
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //90101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //90100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //90011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //90010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //90001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //90000
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatch: //80001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatchPossibleCancellation: //80002
          return EligibilityStatus.NoMatch;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleSafety: //11003
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleUncontrollable: //11004
          return EligibilityStatus.NotEligible;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonNotYetKnown: // 20003 (used to be 20001)
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonPending: // 20004  (used to be 20002)
          return EligibilityStatus.Pending;

        case FlightDisruptionMatchAndEligibilityStatus.NotEligibleFlightDateBeforeRegulationEnforcement: //11007
          return EligibilityStatus.OutsidePeriod;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleFlightDateTooOld: //11002
          return EligibilityStatus.Over365;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayFoundRoutesHaveOtherCarrierFlights: //30001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayNotFoundRoutesHaveOtherCarrierFlights: //30002
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlights: //80003
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlightsAndPossibleCancellation: //80004
          return EligibilityStatus.OtherAirlines;

        //case 70001: Note: did not map code 70001 since it does not exist in the FD API.
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableRegulationIsNotAutomated: //70002
          return EligibilityStatus.OutsideAppr;

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundDuplicateClaimFound: //40000
          return EligibilityStatus.DuplicateRequest;

        case FlightDisruptionMatchAndEligibilityStatus.Error: //-1
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedDataMismatch: //-2
        default:
          return EligibilityStatus.NoMatch;
      }
    }

    private (EligibilityStatus, bool) ToSelfEligibilityStatus(FlightDisruptionMatchAndEligibilityStatus flightDisruptionMatchAndEligibilityStatus)
    {
      switch (flightDisruptionMatchAndEligibilityStatus)
      {
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalWithDelayOnFlights: //11005
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalNoDelayOnFlights: //11006
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleMinimumDelayNotReached: //11001
          return (EligibilityStatus.NoDisruption, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleSafety: //11003
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleUncontrollable: //11004
          return (EligibilityStatus.NotEligible, true);
            
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllable: //10001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllablePossibleCancellation://10002
          return (EligibilityStatus.Eligible, true);

        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //91010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //91011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //91110
          return (EligibilityStatus.NoMatch, true);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonNotYetKnown: // 20003 (used to be 20001)
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonPending: // 20004  (used to be 20002)
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundFutureFlightInsideProtectionPeriod: // 70004  (used to be 20002)
          return (EligibilityStatus.Pending, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleFlightDateTooOld: //11002
          return (EligibilityStatus.Over365, false);

        case FlightDisruptionMatchAndEligibilityStatus.NotEligibleFlightDateBeforeRegulationEnforcement: //11007
          return (EligibilityStatus.OutsidePeriod, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayFoundRoutesHaveOtherCarrierFlights: //30001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayNotFoundRoutesHaveOtherCarrierFlights: //30002
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlights: //80003
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlightsAndPossibleCancellation: //80004
          return (EligibilityStatus.OtherAirlines, true);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableRegulationIsNotAutomated: //70002
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundFlightDateTooOldEU: //70005
          return (EligibilityStatus.OutsideAppr, true);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundDuplicateClaimFound: //40000
          return (EligibilityStatus.DuplicateRequest, false);

        case FlightDisruptionMatchAndEligibilityStatus.DisruptionCaseAlreadyExists: //60001
          return (EligibilityStatus.DisruptionCaseAlreadyExists, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightDisruptionAndExpenseCaseAlreadyExists: //60002
          return (EligibilityStatus.DisruptionAndExpenseCaseAlreadyExists, false);

        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatch: //80001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatchPossibleCancellation: //80002
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //91101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //91100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //91000
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //91001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxFound: //90111
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //90110
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //90101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //90100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //90011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //90010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //90001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //90000
          return (EligibilityStatus.UnableDetermination, true);

        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideEligiblewGoodwill://30004
          return (EligibilityStatus.IncidentEligible, true);

        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideReasonPending: // 30003 
          return (EligibilityStatus.IncidentPending, false);

        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligibleNoPayout: //31001
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligiblewGoodwill: //31002
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligibleRequiredforSafetywGoodwill: //31002
          return (EligibilityStatus.IncidentNotEligible, true);

        case FlightDisruptionMatchAndEligibilityStatus.Error: //-1
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedDataMismatch: //-2
        default:
          return (EligibilityStatus.NoMatch, false);
      }
    }

    private (EligibilityStatus, bool) ToSelfExpenseEligibilityStatus(FlightDisruptionMatchAndEligibilityStatus flightDisruptionMatchAndEligibilityStatus, bool isEUflight, int? delayInMins, DateTimeOffset? departureDate, bool? isExpenseExist, bool? isSpecialCustomerExpense)
    {
      bool isTwoHoursDelay = (delayInMins != null && delayInMins >= 120);

      if (isExpenseExist.HasValue && isExpenseExist.Value)
      {
        return (EligibilityStatus.ExpenseCaseAlreadyExists, false);
      }

      if (isSpecialCustomerExpense.HasValue && isSpecialCustomerExpense.Value)
      {
        return (EligibilityStatus.Eligible, true);
      }

      switch (flightDisruptionMatchAndEligibilityStatus)
      {
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllable: //10001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllablePossibleCancellation://10002
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundEligibleControllableFlightNumberFallback: //21001
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideEligiblewGoodwill://30004
          return isTwoHoursDelay == true ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.Eligible, true);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleSafety: //11003
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligiblewGoodwill: //31002
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleSafetyFlightNumberFallback: //12003,
          return isTwoHoursDelay == true ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.EligibleSafety, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleUncontrollable: //11004
          return isTwoHoursDelay == true ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.NotEligible, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleMinimumDelayNotReached: //11001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalWithDelayOnFlights: //11005
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalNoDelayOnFlights: //11006
          return isTwoHoursDelay == true ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.NotEligible, false);
            
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundFlightDateTooOldEU: //70005
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleFlightDateTooOld: //11002
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleFlightDateTooOldFlightNumberFallback: //12002
          return isTwoHoursDelay == true && isEUflight ? (EligibilityStatus.Eligible, true) : CheckDepatureDateForSelfExpenses(departureDate);

        case FlightDisruptionMatchAndEligibilityStatus.NotEligibleFlightDateBeforeRegulationEnforcement: //11007
          return (EligibilityStatus.NotEligible, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonNotYetKnown: // 20003 (used to be 20001)
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableReasonPending: // 20004  (used to be 20002)
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideReasonPending: // 30003 
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundFutureFlightInsideProtectionPeriod: // 70004
          return (EligibilityStatus.Pending, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundDuplicateClaimFound: //40000
          return (EligibilityStatus.DuplicateRequest, true);

        case FlightDisruptionMatchAndEligibilityStatus.ExpenseCaseAlreadyExists: //60000
        case FlightDisruptionMatchAndEligibilityStatus.FlightDisruptionAndExpenseCaseAlreadyExists: //60002
          return (EligibilityStatus.ExpenseCaseAlreadyExists, false);

        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligibleNoPayout: //31001
        case FlightDisruptionMatchAndEligibilityStatus.IncidentsHandlingOverrideNotEligibleRequiredforSafetywGoodwill: //31003
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleMinimumDelayNotReachedFlightNumberFallback: //12001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleUncontrollableFlightNumberFallback: //12004,
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalWithDelayOnFlightsFlightNumberFallback: //12005,
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotEligibleNoDelayAtArrivalNoDelayOnFlightsFlightNumberFallback: //12006,
          return isTwoHoursDelay == true ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.NotEligible, false);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayFoundRoutesHaveOtherCarrierFlights: //30001
        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableACDelayNotFoundRoutesHaveOtherCarrierFlights: //30002
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlights: //80003
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesHaveOtherCarrierFlightsAndPossibleCancellation: //80004
          return isTwoHoursDelay == true && isEUflight ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.OtherAirlines, true);

        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatch: //80001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedRoutesDoNotMatchPossibleCancellation: //80002
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //91101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //91100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //91000
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //91001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxFound: //90111
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //90110
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxFound: //90101
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxFoundActualFlightNotFoundActualPaxNotFound: //90100
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //90011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //90010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxFound: //90001
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightNotFoundSnapPaxNotFoundActualFlightNotFoundActualPaxNotFound: //90000
          return isTwoHoursDelay == true && isEUflight ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.UnableDetermination, true);

        case FlightDisruptionMatchAndEligibilityStatus.FlightAndPaxFoundNotDeterminableRegulationIsNotAutomated: //70002
          return isTwoHoursDelay == true && isEUflight ? (EligibilityStatus.Eligible, true) : (EligibilityStatus.OutsidePeriod, false);

        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxNotFound: //91010
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxNotFoundActualFlightFoundActualPaxFound: //91011
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedSnapFlightFoundSnapPaxFoundActualFlightFoundActualPaxNotFound: //91110
          return (EligibilityStatus.NoMatch, false);

        case FlightDisruptionMatchAndEligibilityStatus.Error: //-1
        case FlightDisruptionMatchAndEligibilityStatus.NotProcessedDataMismatch: //-2
        default:
          return (EligibilityStatus.NotEligible, false);
      }
    }

    private (EligibilityStatus, bool) CheckDepatureDateForSelfExpenses(DateTimeOffset? depatureDateTime)
    {
      if (depatureDateTime.HasValue && DateTime.UtcNow <= depatureDateTime.Value.AddYears(2))
      {
        return (EligibilityStatus.Eligible, true);
      }

      return (EligibilityStatus.NotEligible, false);
    }

    public static string ToCamelCase(string text) =>
      text.Substring(0, 1).ToLowerInvariant() + text.Substring(1);
  }
}