import { AnalyticsService } from '../analytics/analytics.service';
import { AppInsightsService } from '../../../shared/monitoring/app-insights.service';
import { AssessmentService } from '../assessment/assessment.service';
import { environment } from 'src/environments/environment';
import { EnvironmentEnum } from 'src/app/shared/models/environment.enum';
import {
  GatewayRequest,
  GatewayResponse,
  IValidationException
} from '../../models/api-gateway.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OperationType } from '../../constants/common';
import { SearchForm } from '../../models/search-form.interface';
import { take, tap, map, timeout } from 'rxjs/operators';
import * as MOCK_ASSESSMENT_LIST from '../../mocks/assessment.mock';

@Injectable({
  providedIn: 'root'
})
export class EligibilityService {
  private baseUrl = environment.api;

  constructor(
    private analytics: AnalyticsService,
    private appInsightsService: AppInsightsService,
    private assessmentService: AssessmentService,
    private http: HttpClient
  ) {}

  private performEligibilityRequest(
    body: GatewayRequest
  ): Observable<GatewayResponse> {
    const start = new Date().getTime();

    const url = new URL(
      this.baseUrl.indexOf('localhost:7071') > -1 &&
      environment.environmentName === 'DIT'
        ? 'GatewayPrivate/v2'
        : 'Gateway/v2',
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
      map((r: GatewayResponse) => r)
    );
  }

  getBodyRequest(
    searchForm: SearchForm,
    token: string,
    operation?: OperationType
  ): GatewayRequest {
    return {
      eligibilityRequest: {
        lastName: searchForm.lastName,
        ticketNumber: searchForm.ticket
      },
      gatewayRequestContext: {
        isRecaptchaEnabled: true,
        recaptchaResponseToken: token,
        runtimeEnvironment: EnvironmentEnum[environment.environmentName]
      },
      operationType: operation ? operation : OperationType.Assessment,
      sessionId: this.analytics.getSessionId()
    };
  }

  logCaseCreation(
    searchForm: SearchForm,
    token: string
  ): Observable<GatewayResponse> {
    const body: GatewayRequest = this.getBodyRequest(
      searchForm,
      token,
      OperationType.CaseCreation
    );
    return this.performEligibilityRequest(body);
  }

  searchEligibility(
    searchForm: SearchForm,
    token: string
  ): Observable<GatewayResponse> {
    let r: GatewayResponse;
    let mockedExceptions: IValidationException[];
    this.assessmentService.ticketNumber = searchForm?.ticket;

    if (
      environment.environmentName === 'DIT' ||
      environment.environmentName === 'SIT'
    ) {
      switch (searchForm.lastName) {
        case 'Doe':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_DOE;
          break;
        case 'Franklin':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_FRANKLIN;
          break;
        case 'Murphy':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_MURPHY;
          break;
        case 'DUPLICATED':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_DUPLICATED;
          break;
        case 'ELIGIBLE':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_ELIGIBLE_DISRUPTION;
          break;
        case 'ELIGIBLE1':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_ELIGIBLE_NODISRUPTION;
          break;
        case 'EXPENSE':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_EXPENSE;
          break;
        case 'INCIDENTELIGIBLE':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_INCIDENT_ELIGIBLE;
          break;
        case 'INCIDENTNOTELIGIBLE':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_INCIDENT_NOTELIGIBLE;
          break;
        case 'INCIDENTPENDING':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_INCIDENT_PENDING;
          break;
        case 'MULTI':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_MULTI;
          break;
        case 'NOCLAIM':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_NOCLAIM;
          break;
        case 'NODISRUPTION':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_NODISRUPTION;
          break;
        case 'NOMATCH':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_NOMATCH;
          break;
        case 'NOTELIGIBLE':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_NOTELIGIBLE_DISRUPTION;
          break;
        case 'NOTELIGIBLE1':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_NOTELIGIBLE_NODISRUPTION;
          break;
        case 'PENDING':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_PENDING;
          break;
        case 'OAL':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_OAL;
          break;
        case 'OUTSIDEPERIOD':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_OUTSIDEPERIOD;
          break;
        case 'OVER365':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_OVER365;
          break;
        case 'UNABLEDETERMINATION':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_UNABLE_DETERMINATION;
          break;
        case 'VALIDATION':
          r = MOCK_ASSESSMENT_LIST.MOCK_ASSESSMENT_VALIDATION;
          mockedExceptions = r.validationExceptions;
          break;
        default:
          break;
      }
    }

    if (typeof r === 'undefined') {
      const body: GatewayRequest = this.getBodyRequest(searchForm, token);
      return this.performEligibilityRequest(body);
    } else {
      if (mockedExceptions) {
        return throwError({ status: 400, error: r });
      } else {
        return of(r);
      }
    }
  }
}
