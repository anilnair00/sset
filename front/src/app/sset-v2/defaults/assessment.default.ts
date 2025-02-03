import { DynamicsWebRequestResponse } from '../models/api-dynamics-web-request.interface';
import { ExpenseDetails } from '../models/expense.interface';
import { GatewayResponse } from '../models/api-gateway.interface';
import { Passenger } from '../models/passenger.interface';

export const DEFAULT_ASSESSMENT: GatewayResponse = {
  additionalPassengers: [],
  errorCode: 0,
  errorMessage: '',
  originDestination: [],
  passenger: {} as any,
  pnrNumber: '',
  statusCode: 0,
  statusDescription: null,
  validationExceptions: null
};

export const DEFAULT_CLAIM_SUBMISSION_RESPONSE: DynamicsWebRequestResponse = {
  businessRuleValidationResults: null,
  exceptionMessage: '',
  originDestinations: null,
  reCaptchaValidationResults: null
};

export const DEFAULT_EXPENSE_DETAILS: ExpenseDetails = {
  accommodationDays: 0,
  amount: 0,
  currency: '',
  currencyCode: '',
  currencyDynamicsId: 0,
  disruptionCity: '',
  expenseType: '',
  expenseTypeDynamicsId: 0,
  expenseTypeId: 0,
  mealType: '',
  mealTypeDynamicsId: 0,
  transportationType: '',
  transportationTypeDynamicsId: 0
};

export const DEFAULT_PASSENGER_DETAILS: Passenger = {
  addressStreet: '',
  aeroplanStatus: '',
  city: '',
  confirmEmailAddress: '',
  country: '',
  countryDynamicsId: 0,
  emailAddress: '',
  firstName: '',
  freqFlyerNumber: '',
  isClaimingCompensation: false,
  isClaimingExpenses: false,
  isPrimaryApplicant: true,
  isSelected: true,
  lastName: '',
  mobilePhone: '',
  primaryPhoneNumber: '',
  province: '',
  provinceDynamicsId: '',
  ticketNumber: '',
  title: '',
  titleDynamicsId: 0,
  zipCode: ''
};

export const DEFAULT_PASSENGER_DETAILS_LIST: Passenger[] = [
  DEFAULT_PASSENGER_DETAILS
];
