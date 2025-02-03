import { EligibilityStatus } from './eligibility-status.enum';

// Request models
export interface IGatewayRequest {
  sessionId: string;
  operationType: OperationType;
  eligibilityRequest: IEligibilityRequest;
  gatewayRequestContext?: IGatewayRequestContext;
}

export enum OperationType {
  ASSESSMENT = 'Assessment',
  CR = 'CaseCreation'
}
export interface IEligibilityRequest {
  ticketNumber?: string;
  pnr?: string;
  firstName: string;
  lastName: string;
  flightDate: string;
}

export interface IGatewayRequestContext {
  runtimeEnvironment?: string;
  validationExceptions?: IValidationException[];
  isRecaptchaEnabled?: boolean;
  recaptchaResponseToken?: string;
}

export interface IEligibilityResponse {
  statusCode: number;
  statusDescription: EligibilityStatus;
  disruptionCode?: number;
  mostSignificantLegId?: string;
  errorMsg?: string;
  arrivalDelayIATACode?: number;
  secondaryCancellationReasonCode?: string;
  originalDynamicCaseNumber?: string;
}

export interface IGatewayResponse {
  gatewayRequest?: IGatewayRequest;
  exceptionMessage?: string;
  eligibilityResponse: IEligibilityResponse;
  passengerProtectionResponse?: any;
}

export interface IValidationException {
  propertyName: string;
  businessRuleCode: number;
}
