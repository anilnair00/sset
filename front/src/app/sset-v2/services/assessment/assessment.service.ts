import { BehaviorSubject, Observable } from 'rxjs';
import { Claim } from '../../models/assessment.interface';
import {
  DEFAULT_ASSESSMENT,
  DEFAULT_CLAIM_SUBMISSION_RESPONSE
} from '../../defaults/assessment.default';
import {
  DynamicsWebRequest,
  DynamicsWebRequestResponse
} from '../../models/api-dynamics-web-request.interface';
import { environment } from '../../../../environments/environment';
import { GatewayResponse } from '../../models/api-gateway.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pages } from '../../constants/common';
import { PassengerDetailsService } from '../passenger-details/passenger-details.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private baseUrl = environment.api;
  private _addClaims = new BehaviorSubject<Claim[]>([]);
  private _assessmentResponse = new BehaviorSubject<GatewayResponse>(
    DEFAULT_ASSESSMENT
  );
  private _claimIndex = new BehaviorSubject<number>(0);
  private _claimSubmissionResponse =
    new BehaviorSubject<DynamicsWebRequestResponse>(
      DEFAULT_CLAIM_SUBMISSION_RESPONSE
    );
  private _error = new BehaviorSubject<boolean>(false);
  private _loading = new BehaviorSubject<boolean>(false);
  private _manualFlow = new BehaviorSubject<boolean>(false);
  private _ticketNumber = new BehaviorSubject<string>('');

  addedClaims$: Observable<Claim[]> = this._addClaims.asObservable();
  assessmentCode$ = new BehaviorSubject<any>({
    code: '10001',
    message: ''
  });
  assessmentPage$ = new BehaviorSubject<string>(Pages.FlightDetails);
  assessmentResponse$: Observable<GatewayResponse> =
    this._assessmentResponse.asObservable();
  claimSubmissionResponse$: Observable<DynamicsWebRequestResponse> =
    this._claimSubmissionResponse.asObservable();
  claimIndex$: Observable<number> = this._claimIndex.asObservable();
  error$: Observable<boolean> = this._error.asObservable();
  loading$: Observable<boolean> = this._loading.asObservable();
  manualFlow$: Observable<boolean> = this._manualFlow.asObservable();
  ticketNumber$: Observable<string> = this._ticketNumber.asObservable();

  constructor(
    private http: HttpClient,
    private passengerDetailsService: PassengerDetailsService
  ) {}

  set addClaims(itineraries: Claim[]) {
    this._addClaims.next(itineraries);
  }

  set assessmentResponse(response: GatewayResponse) {
    this._assessmentResponse.next(response);
  }

  set claimIndex(index: number) {
    this._claimIndex.next(index);
  }

  set claimSubmissionResponse(response: DynamicsWebRequestResponse) {
    this._claimSubmissionResponse.next(response);
  }

  set error(flag: boolean) {
    this._error.next(flag);
  }

  set loading(flag: boolean) {
    this._loading.next(flag);
  }

  set manualFlow(flag: boolean) {
    this._manualFlow.next(flag);
  }

  set ticketNumber(ticket: string) {
    this._ticketNumber.next(ticket);
  }

  getAssessmentCode$(): Observable<any> {
    return this.assessmentCode$.asObservable();
  }

  getAssessmentPage$(): Observable<string> {
    return this.assessmentPage$.asObservable();
  }

  resetSearch$(): void {
    this._addClaims.next([]);
    this._assessmentResponse.next(DEFAULT_ASSESSMENT);
    this._claimSubmissionResponse.next(DEFAULT_CLAIM_SUBMISSION_RESPONSE);
    this._error.next(false);
    this._ticketNumber.next('');
    this.passengerDetailsService.passengerDetailsList = [];
    this.assessmentPage$.next(Pages.FlightDetails);
  }

  setAssessmentCode$(assessmentObject): void {
    this.assessmentCode$.next(assessmentObject);
  }

  setAssessmentPage$(page: string): void {
    this.assessmentPage$.next(page);
  }

  submitClaim$(
    claimDetailObj: DynamicsWebRequest
  ): Observable<DynamicsWebRequestResponse> {
    const url = new URL(
      this.baseUrl.indexOf('localhost:7071') > -1 &&
      environment.environmentName === 'DIT'
        ? 'CreateDynamicsWebRequestPrivate'
        : 'CreateDynamicsWebRequest',
      this.baseUrl
    );
    return this.http.post<DynamicsWebRequestResponse>(
      url.href,
      claimDetailObj,
      httpOptions
    );
  }
}
