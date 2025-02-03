import { IEligibilityResponse } from '../models/api-gateway.interface';
import { EligibilityStatus } from '../models/eligibility-status.enum';

export const MOCK_ELIGIBLE_DISRUPTION: IEligibilityResponse = {
  statusCode: 10,
  statusDescription: EligibilityStatus.ELIGIBLE,
  arrivalDelayIATACode: 1
};

export const MOCK_ELIGIBLE_NODISRUPTION: IEligibilityResponse = {
  statusDescription: EligibilityStatus.ELIGIBLE,
  statusCode: 10
};

export const MOCK_NOTELIGIBLE_DISRUPTION: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOTELIGIBLE,
  arrivalDelayIATACode: 1,
  statusCode: 40
};

export const MOCK_NOTELIGIBLE_NODISRUPTION: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOTELIGIBLE,
  statusCode: 40
};

export const MOCK_NOMATCH: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOMATCH,
  statusCode: 30
};

export const MOCK_PENDING: IEligibilityResponse = {
  statusDescription: EligibilityStatus.PENDING,
  statusCode: 50
};

export const MOCK_PENDING_3: IEligibilityResponse = {
  statusDescription: EligibilityStatus.PENDING,
  statusCode: 50,
  disruptionCode: 20004
};

export const MOCK_OAL: IEligibilityResponse = {
  statusDescription: EligibilityStatus.OAL,
  statusCode: 80
};

export const MOCK_OUTSIDEPERIOD: IEligibilityResponse = {
  statusDescription: EligibilityStatus.OUTSIDEPERIOD,
  statusCode: 60
};

export const MOCK_NODISRUPTION: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NODISRUPTION,
  statusCode: 20
};

export const MOCK_OVER365: IEligibilityResponse = {
  statusDescription: EligibilityStatus.OVER365,
  statusCode: 70
};

export const MOCK_70005: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOMATCH,
  statusCode: 30,
  disruptionCode: 70005,
  arrivalDelayIATACode: 18
};

export const MOCK_10002: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOMATCH,
  statusCode: 30,
  disruptionCode: 10002,
  arrivalDelayIATACode: 18
};

export const MOCK_21002: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOMATCH,
  statusCode: 30,
  disruptionCode: 21002,
  arrivalDelayIATACode: 18
};

export const MOCK_DUPLICATED: IEligibilityResponse = {
  statusDescription: EligibilityStatus.NOTELIGIBLE,
  statusCode: 40,
  disruptionCode: 4000,
  arrivalDelayIATACode: 18,
  originalDynamicCaseNumber: 'CAS-97513-H5K5D5'
};

export const MOCK_UNABLE_DETERMINATION: IEligibilityResponse = {
  statusCode: 30,
  statusDescription: EligibilityStatus.ELIGIBLE,
  disruptionCode: 80001,
  arrivalDelayIATACode: null,
  originalDynamicCaseNumber: null,
  mostSignificantLegId: null,
  secondaryCancellationReasonCode: null
};
