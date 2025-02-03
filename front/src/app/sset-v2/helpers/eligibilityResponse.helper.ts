import { EligibilityResponseInterface } from '../models/assessment.interface';
import { EligibilityStatus } from '../constants/eligibility';
import { OriginDestinationGatewayResponse } from '../models/api-gateway.interface';

export const getEligibilityCodeInfo = (r: OriginDestinationGatewayResponse) => {
  if (!r) return;

  let eligibilityResponse: EligibilityResponseInterface = {
    addClaimButtonEnabled: r.addClaimButtonEnabled,
    compensationEligibilityStatus: r.matchAndClaimEligibility,
    findOutMoreLink: false,
    message: '',
    originalDynamicCaseNumber: r.originalDynamicCaseNumber,
    title: ''
  };

  eligibilityResponse.reason = r.arrivalDelayIATACode
    ? r.arrivalDelayIATACode.toString()
    : r.secondaryCancellationReasonCode
    ? r.secondaryCancellationReasonCode
    : undefined;

  switch (eligibilityResponse.compensationEligibilityStatus) {
    // 40000
    case EligibilityStatus.DuplicateRequest:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEREQUEST.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEREQUEST.TITLE'
      };
      break;

    // 60001
    case EligibilityStatus.DuplicateDisruption:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEDISRUPTION.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEDISRUPTION.TITLE'
      };
      break;

    // 60002
    case EligibilityStatus.DuplicateDisruptionAndExpense:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        // isExpenseButtonEnabled: false,
        message:
          'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEDISRUPTIONANDEXPENSE.TEXT',
        title:
          'SSET_V2.PASSENGER_ELIGIBILITY.DUPLICATEDISRUPTIONANDEXPENSE.TITLE'
      };
      break;

    // 10001
    case EligibilityStatus.Eligible:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.ELIGIBLE.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.ELIGIBLE.TITLE'
      };
      break;

    // 30004
    case EligibilityStatus.IncidentEligible:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: false,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTELIGIBLE.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTELIGIBLE.TITLE'
      };
      break;

    // 31001, 31002, 31003
    case EligibilityStatus.IncidentNotEligible:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: true,
        message: r.isExpenseButtonEnabled
          ? 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTNOTELIGIBLE.TEXT_EXPENSE'
          : 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTNOTELIGIBLE.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTNOTELIGIBLE.TITLE'
      };
      break;

    // 30003
    case EligibilityStatus.IncidentPending:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTPENDING.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.INCIDENTPENDING.TITLE'
      };
      break;

    // 11001, 11005, 11006
    case EligibilityStatus.NoDisruption:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.NODISRUPTION.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.NODISRUPTION.TITLE'
      };
      break;

    // 11003, 11004
    case EligibilityStatus.NotEligible:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: true,
        message: r.isExpenseButtonEnabled
          ? 'SSET_V2.PASSENGER_ELIGIBILITY.NOTELIGIBLE.TEXT_EXPENSE'
          : 'SSET_V2.PASSENGER_ELIGIBILITY.NOTELIGIBLE.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.NOTELIGIBLE.TITLE'
      };
      break;

    // 30001, 30002, 80003, 80004
    case EligibilityStatus.OAL:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: false,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.OTHERAIRLINES.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.OTHERAIRLINES.TITLE'
      };
      break;

    // 11007
    case EligibilityStatus.OutsidePeriod:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: false,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.OUTSIDEPERIOD.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.OUTSIDEPERIOD.TITLE'
      };
      break;

    // 70002, 70005
    case EligibilityStatus.OutsideAppr:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.OUTSIDEAPPR.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.OUTSIDEAPPR.TITLE'
      };
      break;

    // 11002
    case EligibilityStatus.Over365:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: false,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.OVER365.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.OVER365.TITLE'
      };
      break;

    // 20003, 2004, 70004
    case EligibilityStatus.Pending:
      if (r.matchAndClaimEligibilityCode === 70004) {
        // Claim too early – flight date in the future
        eligibilityResponse = {
          ...eligibilityResponse,
          // addClaimButtonEnabled: false,
          findOutMoreLink: false,
          message: 'SSET_V2.PASSENGER_ELIGIBILITY.PENDING_FUTURE.TEXT',
          title: 'SSET_V2.PASSENGER_ELIGIBILITY.PENDING_FUTURE.TITLE'
        };
      } else {
        // Claim too early – assessment pending
        eligibilityResponse = {
          ...eligibilityResponse,
          // addClaimButtonEnabled: false,
          findOutMoreLink: false,
          message: 'SSET_V2.PASSENGER_ELIGIBILITY.PENDING.TEXT',
          title: 'SSET_V2.PASSENGER_ELIGIBILITY.PENDING.TITLE'
        };
      }
      eligibilityResponse.reason = undefined; // hide the actual reason
      break;

    // 80001, 80002, 90000, 90001, 90010, 90011, 90100,
    // 90101, 90110, 91000, 91001, 91100, 91101, 90111
    case EligibilityStatus.UnableDetermination:
      eligibilityResponse = {
        ...eligibilityResponse,
        // addClaimButtonEnabled: true,
        findOutMoreLink: true,
        message: 'SSET_V2.PASSENGER_ELIGIBILITY.UNABLEDETERMINATION.TEXT',
        title: 'SSET_V2.PASSENGER_ELIGIBILITY.UNABLEDETERMINATION.TITLE'
      };
      break;

    default:
      break;
  }

  return eligibilityResponse;
};
