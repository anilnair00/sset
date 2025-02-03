import { AeroplanStatus } from './assessment.interface';
import { Country, Title } from './dropdown.interface';

export interface Passenger {
  addressStreet: string;
  aeroplanStatus: string;
  city: string;
  confirmEmailAddress: string;
  country: string;
  countryDynamicsId: number;
  emailAddress: string;
  firstName: string;
  freqFlyerNumber: string;
  isClaimingCompensation: boolean;
  isClaimingExpenses: boolean;
  isPrimaryApplicant: boolean;
  lastName: string;
  mobilePhone: string;
  primaryPhoneNumber: string;
  province: string;
  provinceDynamicsId: string;
  ticketNumber: string;
  title: string;
  titleDynamicsId: number;
  zipCode: string;
  aeroplanDynamicsId?: number;
  isSameAddressContact?: boolean;
  isSelected?: boolean;
  isValid?: boolean;
  order?: number;
}

export interface PassengerFormData {
  countries: Country[];
  starAllianceTiers: AeroplanStatus[];
  titles: Title[];
}

export interface PassengerSubmission {
  acStarAllianceTierDynamicsId?: number;
  addressStreet: string;
  aeroPlanNumber: string;
  city: string;
  confirmEmail: string;
  countryDynamicsId: number;
  email: string;
  firstName: string;
  isAddressSameAsPrimaryApplicant: boolean;
  isClaimingCompensation: boolean;
  isClaimingExpenses: boolean;
  isPrimaryApplicant: boolean;
  lastName: string;
  mobilePhone: string;
  primaryPhone: string;
  provinceState: string;
  ticketNumber: string;
  titleDynamicsId: number;
  zipCode: string;
}
