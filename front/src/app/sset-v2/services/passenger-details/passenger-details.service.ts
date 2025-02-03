import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Passenger,
  PassengerFormData,
  PassengerSubmission
} from '../../models/passenger.interface';

@Injectable({
  providedIn: 'root'
})
export class PassengerDetailsService {
  private apiCode = environment.apiCode;
  private baseUrl = environment.api;
  private _passengerDetailsList = new BehaviorSubject<Passenger[]>([]);
  private _passengerSubmissionList = new BehaviorSubject<PassengerSubmission[]>(
    []
  );

  passengerDetailsList$: Observable<Passenger[]> =
    this._passengerDetailsList.asObservable();
  passengerFormData$: Observable<PassengerFormData>;
  passengerSubmissionList$: Observable<PassengerSubmission[]> =
    this._passengerSubmissionList.asObservable();

  constructor(private http: HttpClient) {}

  set passengerDetailsList(passengerDetailsList: Passenger[]) {
    this._passengerDetailsList.next(passengerDetailsList);
    this._passengerSubmissionList.next(
      this.getPassengerSubmissionList(passengerDetailsList)
    );
  }

  getPassengerFormData$(languageCode: string): Observable<PassengerFormData> {
    const url = new URL(
      `GetPassengerFormLookupData?code=${this.apiCode}&languageCode=${languageCode}-CA`,
      this.baseUrl
    );
    this.passengerFormData$ = this.http.get<PassengerFormData>(url.href);
    return this.passengerFormData$;
  }

  getPassengerSubmissionList(
    passengerDetailsList: Passenger[]
  ): PassengerSubmission[] {
    if (!passengerDetailsList?.length) {
      return [];
    }
    const primaryPassengerDetails = passengerDetailsList[0];
    return passengerDetailsList
      .filter((p) => p.isSelected && p.isValid)
      .map((p) => {
        const country = p.isSameAddressContact
          ? primaryPassengerDetails.country
          : p.country;
        const province = p.isSameAddressContact
          ? primaryPassengerDetails.province
          : p.province;
        const provinceDynamicsId = p.isSameAddressContact
          ? primaryPassengerDetails.provinceDynamicsId
          : p.provinceDynamicsId;
        const countryCode =
          country === 'Canada'
            ? 'CAN'
            : country === 'United States of America' || country === 'États-Unis'
            ? 'USA'
            : '';
        const provinceState =
          countryCode === 'CAN' || countryCode === 'USA'
            ? provinceDynamicsId
            : province;
        const passengerSubsmissionDetails: PassengerSubmission = {
          acStarAllianceTierDynamicsId: p.isSameAddressContact
            ? primaryPassengerDetails.aeroplanDynamicsId
            : p.aeroplanDynamicsId,
          addressStreet: p.isSameAddressContact
            ? primaryPassengerDetails.addressStreet
            : p.addressStreet,
          aeroPlanNumber: p.isSameAddressContact
            ? primaryPassengerDetails.freqFlyerNumber
            : p.freqFlyerNumber,
          city: p.isSameAddressContact ? primaryPassengerDetails.city : p.city,
          confirmEmail: p.isSameAddressContact
            ? primaryPassengerDetails.confirmEmailAddress
            : p.confirmEmailAddress,
          countryDynamicsId: p.isSameAddressContact
            ? primaryPassengerDetails.countryDynamicsId
            : p.countryDynamicsId,
          email: p.isSameAddressContact
            ? primaryPassengerDetails.emailAddress
            : p.emailAddress,
          firstName: p.firstName,
          isAddressSameAsPrimaryApplicant: p.isSameAddressContact,
          isClaimingCompensation: p.isClaimingCompensation,
          isClaimingExpenses: p.isClaimingExpenses,
          isPrimaryApplicant: p.isPrimaryApplicant,
          lastName: p.lastName,
          mobilePhone: p.isSameAddressContact
            ? primaryPassengerDetails.mobilePhone
            : p.mobilePhone,
          primaryPhone: p.isSameAddressContact
            ? primaryPassengerDetails.primaryPhoneNumber
            : p.primaryPhoneNumber,
          provinceState: provinceState,
          ticketNumber: p.ticketNumber,
          titleDynamicsId: p.titleDynamicsId,
          zipCode: p.isSameAddressContact
            ? primaryPassengerDetails.zipCode
            : p.zipCode
        };
        return passengerSubsmissionDetails;
      });
  }
}
