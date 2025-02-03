import { EligibilityService } from './services/eligibility.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ISearchForm } from './models/search-form.interface';
import { EligibilityStatus } from './models/eligibility-status.enum';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ngx-captcha';
import {
  IGatewayResponse,
  IEligibilityResponse,
  IValidationException
} from './models/api-gateway.interface';
import { ErrorType } from './models/error.enum';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsSearchInfo } from './models/analytics.interface';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SsetStoreService {
  constructor(
    private eligibilityService: EligibilityService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private analyticsService: AnalyticsService
  ) {}

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  loading$: Observable<boolean> = this._loading.asObservable();

  private _formReset: Subject<boolean> = new Subject<boolean>();
  formReset$: Observable<boolean> = this._formReset.asObservable();

  private _result: BehaviorSubject<IEligibilityResponse> =
    new BehaviorSubject<IEligibilityResponse>(undefined);
  result$: Observable<IEligibilityResponse> = this._result.asObservable();

  private _error: BehaviorSubject<ErrorType> = new BehaviorSubject<ErrorType>(
    undefined
  );
  error$: Observable<ErrorType> = this._error.asObservable();

  private _validationExceptions: BehaviorSubject<IValidationException[]> =
    new BehaviorSubject<IValidationException[]>(undefined);
  validationExceptions$: Observable<IValidationException[]> =
    this._validationExceptions.asObservable();

  private _requestForm: BehaviorSubject<ISearchForm> =
    new BehaviorSubject<ISearchForm>(undefined);
  requestForm$: Observable<ISearchForm> = this._requestForm.asObservable();

  get loading(): boolean {
    return this._loading.getValue();
  }

  set loading(value: boolean) {
    this._loading.next(value);
  }

  get error(): ErrorType {
    return this._error.getValue();
  }

  set error(value: ErrorType) {
    this._error.next(value);
  }

  get result(): IEligibilityResponse {
    return this._result.getValue();
  }

  set result(value: IEligibilityResponse) {
    this._result.next(value);
  }

  get requestForm(): ISearchForm {
    return this._requestForm.getValue();
  }

  set requestForm(value: ISearchForm) {
    this._requestForm.next(value);
  }

  get validationExceptions(): IValidationException[] {
    return this._validationExceptions.getValue();
  }

  set validationExceptions(value: IValidationException[]) {
    this._validationExceptions.next(value);
  }

  async search(form: ISearchForm) {
    this.loading = true;
    this.error = undefined;
    this.requestForm = form;
    this.validationExceptions = undefined;
    this.result = undefined;

    this.reCaptchaV3Service.execute(
      environment.recaptchaSiteKey,
      'find',
      (token) => {
        console.log('Token retrieved from: ', token);
        this.eligibilityService.searchEligibility(form, token).subscribe(
          (gr: IGatewayResponse) => {
            const eligibilityResponse: IEligibilityResponse =
              gr.eligibilityResponse;

            if (eligibilityResponse) {
              this.result = eligibilityResponse;

              const eventInfo: AnalyticsSearchInfo = {
                bookingID: form.pnrTicket,
                departureDate: form.date,
                statusCode: this.result.statusCode.toString(),
                statusDescription: this.result.statusDescription,
                disruptionCode: this.result.disruptionCode
                  ? this.result.disruptionCode.toString()
                  : undefined
              };

              this.analyticsService.formSubmit(eventInfo);

              this.loading = false;
            }
          },
          (err) => {
            const response = err.error;

            console.log(err);

            if (err.name === 'TimeoutError') {
              this.error = ErrorType.TIMEOUT;
              this.result = undefined;
            } else if (
              err.status === 400 &&
              response &&
              response.gatewayRequest &&
              response.gatewayRequest.gatewayRequestContext &&
              response.gatewayRequest.gatewayRequestContext.validationExceptions
            ) {
              this.validationExceptions =
                response.gatewayRequest.gatewayRequestContext.validationExceptions;
              this.validationExceptions.forEach((exception) => {
                let eventInfo: AnalyticsSearchInfo;

                eventInfo = {
                  bookingID: form.pnrTicket,
                  departureDate: form.date,
                  disruptionCode: undefined
                };

                switch (exception.businessRuleCode) {
                  case 1030015:
                    this.result = {
                      statusDescription: EligibilityStatus.OVER365,
                      statusCode: 70
                    };

                    break;
                  case 1030010:
                    this.result = {
                      statusDescription: EligibilityStatus.OUTSIDEPERIOD,
                      statusCode: 60
                    };

                    break;
                  case 1000035:
                    this.error = ErrorType.RECAPTCHA;
                    this.result = undefined;

                    eventInfo = {
                      bookingID: form.pnrTicket,
                      departureDate: form.date,
                      statusCode: '0',
                      statusDescription: ErrorType.RECAPTCHA,
                      disruptionCode: undefined
                    };

                    break;
                }

                if (this.result) {
                  eventInfo.statusCode = this.result.statusCode.toString();
                  eventInfo.statusDescription = this.result.statusDescription;
                }

                this.analyticsService.formSubmit(eventInfo);
              });
            } else {
              // Todo handle other error status
              this.error = ErrorType.SERVER;
            }
            this.loading = false;
          }
        );
      },
      {
        useGlobalDomain: false
      }
    );
  }

  async setError(e: any) {
    this.error = ErrorType.SERVER;
  }

  async createCase() {
    this.reCaptchaV3Service.execute(
      environment.recaptchaSiteKey,
      'find',
      (token) => {
        console.log('Token retrieved from: ', token);
        this.eligibilityService
          .logCaseCreation(this.requestForm, token)
          .pipe(take(1))
          .subscribe(() => {
            // Nothing here, response does not need to be handled.
          });
      },
      {
        useGlobalDomain: false
      }
    );
  }

  async reset() {
    this.result = undefined;
    this.loading = false;
    this.error = undefined;
    this.validationExceptions = undefined;
    this.requestForm = undefined;
    this._formReset.next(true);
  }
}
