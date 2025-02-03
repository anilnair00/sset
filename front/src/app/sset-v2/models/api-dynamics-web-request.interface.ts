import { PassengerSubmission } from './passenger.interface';

export interface BusinessRuleValidationResult {
  businessRuleCode: number;
  propertyName: string;
  validationMessage: string;
}

export interface DynamicsWebRequest {
  isManualFlow: boolean;
  originDestinations: OriginDestinationRequest[];
  passengers: PassengerSubmission[];
  portalLanguageDynamicsId: number;
  recaptchaResponseToken?: string;
  sessionId: string;
}

export interface DynamicsWebRequestResponse {
  businessRuleValidationResults: BusinessRuleValidationResult[] | null;
  exceptionMessage: string | null;
  originDestinations: OriginDestinationResponse[];
  reCaptchaValidationResults: unknown | null;
}

export interface ExpenseRequest {
  amount: number;
  checkInDate?: string;
  checkOutDate?: string;
  currencyCode: string;
  disruptionCityAirportCode?: string;
  expenseTypeDynamicsId: number;
  mealTypeDynamicsId?: number;
  receipts?: ReceiptRequest[];
  transactionDate?: string;
  transportationTypeDynamicsId?: number;
}

export interface ExpenseResponse {
  amount: number;
  currencyCode: string;
  dynamicsExpenseWebRequestId: string;
  expenseTypeDynamicsId: number;
  isSuccessful: boolean;
  receiptResponses: ReceiptResponse[];
}

export interface OriginDestinationRequest {
  arrivalAirportCode: string;
  assessmentId?: string;
  departureAirportCode: string;
  dynamicsWebRequestId?: string;
  expenses?: ExpenseRequest[];
  flightDate: string;
  flightNumber: string;
  isEuRegulation?: boolean;
  pnrNumber?: string;
}

export interface OriginDestinationResponse {
  arrivalAirportCode: string;
  departureAirportCode: string;
  flightDate: string;
  flightNumber: string;
  isSuccessful: boolean;
  passengers: PassengerResponse[];
  pnrNumber: string;
  ticketNumber: string;
}

export interface PassengerResponse {
  compensationClaimWebRequestResponse: WebRequestResponse;
  email: string;
  expenseClaimWebRequestResponse: WebRequestResponse;
  expenseResponse: ExpenseResponse | null;
  firstName: string;
  lastName: string;
  primaryPhone: string;
}

export interface ReceiptRequest {
  documentBody: string | unknown;
  fileName: string;
  mimeType: string;
}

export interface ReceiptResponse {
  dynamicsAnnotationWebRequestId: string;
  fileName: string;
  isSuccessful: boolean;
  mimeType: string;
  subject: string;
}

export interface WebRequestResponse {
  dynamicsWebRequestId: string;
  isSuccessful: boolean;
}
