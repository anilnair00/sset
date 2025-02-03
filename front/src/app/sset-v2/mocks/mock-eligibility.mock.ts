import { EligibilityStatus } from '../constants/eligibility';
import {
  MOCK_FLIGHTS,
  MOCK_FLIGHTS1,
  MOCK_FLIGHTS2,
  MOCK_FLIGHTS3,
  MOCK_FLIGHTS_4,
  MOCK_FLIGHTS_5,
  MOCK_FLIGHTS_ELIGIBLE,
  MOCK_FLIGHTS_NOT_ELIGIBLE,
  MOCK_FLIGHTS_OUTSIDEAPPR
} from './mock-flight.mock';
import { OriginDestinationGatewayResponse } from '../models/api-gateway.interface';

const generateUniqueId = () => {
  const hexDigits = '0123456789abcdef';
  const uuidLengths = [8, 4, 4, 4, 12];

  let uuid = '';
  uuidLengths.forEach((length, index) => {
    if (index > 0) uuid += '-';
    for (let i = 0; i < length; i++) {
      uuid += hexDigits[Math.floor(Math.random() * 16)];
    }
  });

  return uuid;
};

export const MOCK_DUPLICATED: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: generateUniqueId(),
  arrivalDelayIATACode: 43,
  expenseEligibility: EligibilityStatus.DuplicateRequest,
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.DuplicateRequest,
  matchAndClaimEligibilityCode: 4000,
  originalDynamicCaseNumber: 'CAS-105042-Q8V0X0',
  secondaryCancellationReasonCode: null
};

export const MOCK_ELIGIBLE_DISRUPTION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  arrivalDelayIATACode: 11,
  assessmentId: generateUniqueId(),
  expenseEligibility: EligibilityStatus.Eligible,
  flights: MOCK_FLIGHTS_ELIGIBLE,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.Eligible,
  matchAndClaimEligibilityCode: 200,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_ELIGIBLE_NODISRUPTION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'eligible',
  flights: MOCK_FLIGHTS1,
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.Eligible,
  matchAndClaimEligibilityCode: 200,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_EXPENSE: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  arrivalDelayIATACode: 11,
  assessmentId: generateUniqueId(),
  expenseEligibility: 'Eligible',
  flights: MOCK_FLIGHTS,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.Over365,
  matchAndClaimEligibilityCode: 200,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_EXPENSE1: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  arrivalDelayIATACode: 11,
  assessmentId: generateUniqueId(),
  expenseEligibility: 'Eligible',
  flights: MOCK_FLIGHTS,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.Over365,
  matchAndClaimEligibilityCode: 200,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_INCIDENT_ELIGIBLE: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  assessmentId: undefined,
  arrivalDelayIATACode: null,
  expenseEligibility: 'eligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.IncidentEligible,
  matchAndClaimEligibilityCode: 30004,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_INCIDENT_NOTELIGIBLE: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  assessmentId: undefined,
  arrivalDelayIATACode: null,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.IncidentNotEligible,
  matchAndClaimEligibilityCode: 31001,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_INCIDENT_PENDING: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  assessmentId: undefined,
  arrivalDelayIATACode: null,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.IncidentPending,
  matchAndClaimEligibilityCode: 30003,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_NODISRUPTION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: generateUniqueId(),
  arrivalDelayIATACode: null,
  expenseEligibility: EligibilityStatus.NoDisruption,
  flights: MOCK_FLIGHTS_4,
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.NoDisruption,
  matchAndClaimEligibilityCode: 11006,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_NODISRUPTION1: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: generateUniqueId(),
  arrivalDelayIATACode: null,
  expenseEligibility: EligibilityStatus.NoDisruption,
  flights: MOCK_FLIGHTS_5,
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.NoDisruption,
  matchAndClaimEligibilityCode: 11006,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_NOTELIGIBLE: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  arrivalDelayIATACode: null,
  assessmentId: generateUniqueId(),
  expenseEligibility: EligibilityStatus.NotEligible,
  flights: [...MOCK_FLIGHTS_NOT_ELIGIBLE],
  hasEURegulation: false,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.NotEligible,
  matchAndClaimEligibilityCode: 11004,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: 'WXX'
};

export const MOCK_NOTELIGIBLE_DISRUPTION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: MOCK_FLIGHTS2,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.NotEligible,
  matchAndClaimEligibilityCode: 4000,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_NOTELIGIBLE_NODISRUPTION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: MOCK_FLIGHTS3,
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.NotEligible,
  matchAndClaimEligibilityCode: 4000,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_PENDING: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.Pending,
  matchAndClaimEligibilityCode: 2004,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_PENDING_FUTURE: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.Pending,
  matchAndClaimEligibilityCode: 7004,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_OAL: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.OAL,
  matchAndClaimEligibilityCode: 4000,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_OUTSIDEAPPR: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  arrivalDelayIATACode: 99,
  assessmentId: generateUniqueId(),
  expenseEligibility: 'eligible',
  flights: [...MOCK_FLIGHTS_OUTSIDEAPPR],
  hasEURegulation: true,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.OutsideAppr,
  matchAndClaimEligibilityCode: 7005,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_OUTSIDEPERIOD: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  assessmentId: undefined,
  arrivalDelayIATACode: 18,
  expenseEligibility: 'notEligible',
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.OutsideAppr,
  matchAndClaimEligibilityCode: 4000,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_OVER365: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: false,
  arrivalDelayIATACode: 67,
  assessmentId: generateUniqueId(),
  expenseEligibility: EligibilityStatus.NotEligible,
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  hasEURegulation: false,
  isExpenseButtonEnabled: false,
  matchAndClaimEligibility: EligibilityStatus.Over365,
  matchAndClaimEligibilityCode: 11002,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};

export const MOCK_UNABLE_DETERMINATION: OriginDestinationGatewayResponse = {
  addClaimButtonEnabled: true,
  arrivalDelayIATACode: null,
  assessmentId: generateUniqueId(),
  expenseEligibility: EligibilityStatus.UnableDetermination,
  flights: [MOCK_FLIGHTS[0], MOCK_FLIGHTS[1]],
  hasEURegulation: false,
  isExpenseButtonEnabled: true,
  matchAndClaimEligibility: EligibilityStatus.UnableDetermination,
  matchAndClaimEligibilityCode: 80001,
  originalDynamicCaseNumber: null,
  secondaryCancellationReasonCode: null
};
