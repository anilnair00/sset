import { ISearchForm } from './../models/search-form.interface';
import { Injectable } from '@angular/core';
import { take, tap, map, timeout } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import {
  MOCK_ELIGIBLE_DISRUPTION,
  MOCK_NOTELIGIBLE_DISRUPTION,
  MOCK_NOMATCH,
  MOCK_PENDING,
  MOCK_OUTSIDEPERIOD,
  MOCK_NODISRUPTION,
  MOCK_OVER365,
  MOCK_PENDING_3,
  MOCK_OAL,
  MOCK_70005,
  MOCK_DUPLICATED,
  MOCK_10002,
  MOCK_21002,
  MOCK_UNABLE_DETERMINATION
} from '../mocks/mock-eligibility.mock';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  IGatewayRequest,
  IGatewayResponse,
  IEligibilityResponse,
  IValidationException,
  OperationType
} from '../models/api-gateway.interface';
import { AppInsightsService } from '../../shared/monitoring/app-insights.service';
import { EnvironmentEnum } from 'src/app/shared/models/environment.enum';
import { AnalyticsService } from './analytics.service';
import { EligibilityStatus } from '../models/eligibility-status.enum';

@Injectable({
  providedIn: 'root'
})
export class EligibilityService {
  private baseUrl = environment.api;

  constructor(
    private http: HttpClient,
    private appInsightsService: AppInsightsService,
    private analytics: AnalyticsService
  ) {}

  searchEligibility(
    searchForm: ISearchForm,
    token
  ): Observable<IGatewayResponse> {
    // get mocked result status based on PNR Input
    let r: IEligibilityResponse;
    let mockedExceptions: IValidationException[];

    if (
      environment.environmentName === 'DIT' ||
      environment.environmentName === 'SIT'
    ) {
      switch (searchForm.pnrTicket) {
        case 'MELDIS':
          r = MOCK_ELIGIBLE_DISRUPTION;
          break;
        case 'MNEDIS':
          r = MOCK_NOTELIGIBLE_DISRUPTION;
          break;
        case 'MOCKNO':
          r = MOCK_NOMATCH;
          break;
        case 'MNODIS':
          r = MOCK_NODISRUPTION;
          break;
        case 'MOV365':
          r = MOCK_OVER365;
          break;
        case 'MOUTPE':
          r = MOCK_OUTSIDEPERIOD;
          break;
        case 'MOCKPE':
          r = MOCK_PENDING;
          break;
        case 'MOCKP3':
          r = MOCK_PENDING_3;
          break;
        case 'MOCKOA':
          r = MOCK_OAL;
          break;
        case 'MOCK75':
          r = MOCK_70005;
          break;
        case 'MOCK12':
          r = MOCK_10002;
        case 'MOCK21':
          r = MOCK_21002;
          break;
        case 'MOCKDU':
          r = MOCK_DUPLICATED;
          break;
        case 'MOCKUD':
          r = MOCK_UNABLE_DETERMINATION;
          break;
        case 'RECAPF':
          mockedExceptions = [
            {
              propertyName: 'reCaptcha Score',
              businessRuleCode: 1000035
            }
          ];
          r = { statusCode: 0, statusDescription: null };
        default:
          break;
      }
    }

    if (typeof r === 'undefined') {
      const body: IGatewayRequest = this.getBodyRequest(searchForm, token);
      const outtageDates = [
        '2023-05-25',
        '2023-05-26',
        '2023-06-01',
        '2023-06-02'
      ];
      if (outtageDates.includes(body.eligibilityRequest.flightDate)) {
        const mockR = {
          gatewayRequest: this.getMockedResponse(
            searchForm,
            token,
            mockedExceptions
          ),
          exceptionMessage: null,
          passengerProtectionResponse: {},
          eligibilityResponse: MOCK_UNABLE_DETERMINATION
        };
        return of(mockR);
      } else {
        return this.performEligibilityRequest(body);
      }
    } else {
      // Mockup
      const mockR = {
        gatewayRequest: this.getMockedResponse(
          searchForm,
          token,
          mockedExceptions
        ),
        exceptionMessage: null,
        passengerProtectionResponse: {},
        eligibilityResponse: r
      };
      if (mockedExceptions) {
        return throwError({ status: 400, error: mockR });
      } else {
        return of(mockR);
      }
    }
  }

  logCaseCreation(
    searchForm: ISearchForm,
    token
  ): Observable<IGatewayResponse> {
    const body: IGatewayRequest = this.getBodyRequest(
      searchForm,
      token,
      OperationType.CR
    );
    return this.performEligibilityRequest(body);
  }

  private performEligibilityRequest(
    body: IGatewayRequest
  ): Observable<IGatewayResponse> {
    const start = new Date().getTime();

    const url = new URL(
      this.baseUrl.indexOf('localhost:7071') > -1 &&
      environment.environmentName === 'DIT'
        ? 'GatewayPrivate/v1'
        : 'Gateway/v1',
      this.baseUrl
    );

    return this.http.post(url.href, JSON.stringify(body)).pipe(
      timeout(20000),
      take(1),
      tap((r) => {
        // log event in App Insights with responseTime, request & response
        const end = new Date().getTime();
        const duration = `${end - start}ms`;
        const requestStr = JSON.stringify({ ...body.eligibilityRequest });
        const responseStr = JSON.stringify({ ...r['eligibilityResponse'] });
        const eventProperties = {
          request: requestStr,
          response: responseStr,
          responseTime: duration
        };
        this.appInsightsService.logEvent('SSET Search', eventProperties);
      }),
      map((r: IGatewayResponse) => r)
    );
  }

  getBodyRequest(
    searchForm: ISearchForm,
    token: string,
    operation?: OperationType
  ): IGatewayRequest {
    return {
      operationType: operation ? operation : OperationType.ASSESSMENT,
      sessionId: this.analytics.getSessionId(),
      eligibilityRequest: {
        ticketNumber:
          searchForm.pnrTicket.length > 6 ? searchForm.pnrTicket : undefined,
        pnr:
          searchForm.pnrTicket.length <= 6 ? searchForm.pnrTicket : undefined,
        firstName: searchForm.firstName,
        lastName: searchForm.lastName,
        flightDate: searchForm.date
      },
      gatewayRequestContext: {
        runtimeEnvironment: EnvironmentEnum[environment.environmentName],
        recaptchaResponseToken: token,
        isRecaptchaEnabled: true
      }
    };
  }

  getMockedResponse(
    searchForm: ISearchForm,
    token: string,
    mockedExceptions?: IValidationException[]
  ): IGatewayRequest {
    return {
      sessionId: this.analytics.getSessionId(),
      operationType: OperationType.ASSESSMENT,
      eligibilityRequest: {
        ticketNumber:
          searchForm.pnrTicket.length > 6 ? searchForm.pnrTicket : undefined,
        pnr:
          searchForm.pnrTicket.length <= 6 ? searchForm.pnrTicket : undefined,
        firstName: searchForm.firstName,
        lastName: searchForm.lastName,
        flightDate: searchForm.date
      },
      gatewayRequestContext: {
        runtimeEnvironment: EnvironmentEnum[environment.environmentName],
        recaptchaResponseToken: token,
        isRecaptchaEnabled: true,
        validationExceptions: mockedExceptions ? mockedExceptions : undefined
      }
    };
  }
}
