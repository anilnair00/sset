import { EligibilityStatus } from '../constants/eligibility';
import { ExpenseDetails } from './expense.interface';
import { FlightResponse } from './api-gateway.interface';
import { OriginDestinationResponse } from './api-dynamics-web-request.interface';

export interface AeroplanStatus {
  description: string;
  dynamicsId: number;
  id: number;
  languageCode: string;
}

export interface Claim {
  addClaimButtonEnabled?: boolean;
  assessmentId?: string;
  expenseEligibility?: string;
  expenses?: ExpenseDetails[];
  flights: Flight[];
  hasEURegulation?: boolean;
  index: number;
  isClaimingCompensation: boolean;
  isExpenseButtonEnabled: boolean;
  originalDynamicCaseNumber?: string | null;
  pnrNumber?: string;
  ticketNumber?: string;
}

export interface ClaimSubmissionResponse extends OriginDestinationResponse {
  index?: number;
}

export interface EligibilityResponseInterface {
  addClaimButtonEnabled: boolean;
  compensationEligibilityStatus: EligibilityStatus;
  message: string;
  title: string;
  originalDynamicCaseNumber?: string;
  findOutMoreLink?: boolean;
  reason?: string;
}

export interface Flight extends FlightResponse {
  bookingReference?: string;
  ticketNumber?: string;
}
