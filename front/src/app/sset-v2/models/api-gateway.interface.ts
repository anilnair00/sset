import { EligibilityStatus } from '../constants/eligibility';
import { OperationType } from '../constants/common';

export interface EligibilityRequest {
  lastName: string;
  ticketNumber: string;
}

export interface FlightResponse {
  airlineCarrierCode: string;
  airlineName: string;
  flightNumber: number;
  isCancelledFlight: boolean;
  scheduledArrivalAirport: string;
  scheduledArrivalAirportCityName: string;
  scheduledArrivalDate?: string;
  scheduledArrivalTime?: string;
  scheduledDepartureAirport: string;
  scheduledDepartureAirportCityName: string;
  scheduledDepartureDate?: string;
  scheduledDepartureTime?: string;
}

export interface GatewayRequest {
  eligibilityRequest: EligibilityRequest;
  gatewayRequestContext?: GatewayRequestContext;
  operationType: OperationType;
  sessionId: string;
}

export interface GatewayRequestContext {
  isRecaptchaEnabled?: boolean;
  recaptchaResponseToken?: string;
  runtimeEnvironment?: string;
  validationExceptions?: IValidationException[];
}

export interface GatewayResponse {
  additionalPassengers: PassengerResponse[];
  errorCode: number | null;
  errorMessage: string | null;
  originDestination: OriginDestinationGatewayResponse[];
  passenger: PassengerResponse;
  pnrNumber: string;
  statusCode: number | null;
  statusDescription: string | null;
  validationExceptions: IValidationException[] | null;
}

export interface OriginDestinationGatewayResponse {
  addClaimButtonEnabled: boolean;
  arrivalDelayIATACode: number | null;
  assessmentId?: string;
  expenseEligibility: string;
  flights: FlightResponse[];
  hasEURegulation?: boolean;
  isExpenseButtonEnabled: boolean;
  matchAndClaimEligibility: EligibilityStatus;
  matchAndClaimEligibilityCode: number;
  originalDynamicCaseNumber: string | null;
  secondaryCancellationReasonCode: string | null;
}

export interface PassengerResponse {
  acStarAllianceTierDynamicsId?: number;
  aeroPlanNumber?: string;
  firstName: string;
  isPrimaryApplicant: boolean;
  lastName: string;
  ticketNumber: string | null;
}

export interface IValidationException {
  businessRuleCode: number;
  propertyName: string;
}
