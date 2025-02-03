import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EligibilityService } from './services/eligibility/eligibility.service';
import { EligibilityStatus } from './constants/eligibility';
import { environment } from '../../environments/environment';
import { Error } from './constants/error';
import {
  GatewayResponse,
  IValidationException
} from './models/api-gateway.interface';
import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { SearchForm } from './models/search-form.interface';

@Injectable({
  providedIn: 'root'
})
export class SsetStoreService {
  constructor(
    private eligibilityService: EligibilityService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {}

  private _error: BehaviorSubject<Error> = new BehaviorSubject<Error>(
    undefined
  );
  private _formReset: Subject<boolean> = new Subject<boolean>();
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _requestForm: BehaviorSubject<SearchForm> =
    new BehaviorSubject<SearchForm>(undefined);
  private _result: BehaviorSubject<GatewayResponse> =
    new BehaviorSubject<GatewayResponse>(undefined);
  private _validationExceptions: BehaviorSubject<IValidationException[]> =
    new BehaviorSubject<IValidationException[]>(undefined);

  error$: Observable<Error> = this._error.asObservable();
  formReset$: Observable<boolean> = this._formReset.asObservable();
  loading$: Observable<boolean> = this._loading.asObservable();
  requestForm$: Observable<SearchForm> = this._requestForm.asObservable();
  result$: Observable<GatewayResponse> = this._result.asObservable();
  validationExceptions$: Observable<IValidationException[]> =
    this._validationExceptions.asObservable();

  get error(): Error {
    return this._error.getValue();
  }

  get loading(): boolean {
    return this._loading.getValue();
  }

  get requestForm(): SearchForm {
    return this._requestForm.getValue();
  }

  get result(): GatewayResponse {
    return this._result.getValue();
  }

  get validationExceptions(): IValidationException[] {
    return this._validationExceptions.getValue();
  }

  set error(value: Error) {
    this._error.next(value);
  }

  set loading(value: boolean) {
    this._loading.next(value);
  }

  set requestForm(value: SearchForm) {
    this._requestForm.next(value);
  }

  set result(value: GatewayResponse) {
    this._result.next(value);
  }

  set validationExceptions(value: IValidationException[]) {
    this._validationExceptions.next(value);
  }

  async reset() {
    this.error = undefined;
    this.loading = false;
    this.requestForm = undefined;
    this.result = undefined;
    this.validationExceptions = undefined;
    this._formReset.next(true);
  }

  async search(form: SearchForm, callback) {
    this.error = undefined;
    this.loading = true;
    this.requestForm = form;
    this.result = undefined;
    this.validationExceptions = undefined;

    this.reCaptchaV3Service.execute(
      environment.recaptchaSiteKey,
      'find',
      (token) => {
        this.eligibilityService.searchEligibility(form, token).subscribe(
          (eligibilityResponse: GatewayResponse) => {
            this.result = eligibilityResponse;
            callback(eligibilityResponse);
            this.loading = false;
          },
          (err) => {
            console.log(err);
            const response = err.error;
            if (err.name === 'TimeoutError') {
              this.error = Error.Timeout;
              this.result = undefined;
            } else if (
              err.status === 400 &&
              response &&
              response.validationExceptions
            ) {
              this.validationExceptions = response.validationExceptions;
              this.validationExceptions.forEach((exception) => {
                switch (exception.businessRuleCode) {
                  case 1030015:
                    this.result = {
                      ...this.result,
                      statusDescription: EligibilityStatus.Over365,
                      statusCode: 70
                    };
                    break;
                  case 1030010:
                    this.result = {
                      ...this.result,
                      statusDescription: EligibilityStatus.OutsidePeriod,
                      statusCode: 60
                    };
                    break;
                  case 1000035:
                    this.error = Error.Recaptcha;
                    this.result = undefined;
                    break;
                }
              });
            } else {
              // Todo handle other error status
              this.error = Error.Server;
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
    this.error = Error.Server;
  }
}
