import { EligibilityService } from './eligibility.service';
import { GatewayResponse } from '../../models/api-gateway.interface';
import { MOCK_ASSESSMENT_ELIGIBLE_NODISRUPTION } from '../../mocks/assessment.mock';
import { of } from 'rxjs';
import { SearchForm } from '../../models/search-form.interface';

describe('EligibilityService', () => {
  let analyticsServiceSpy: { getSessionId: jasmine.Spy };
  let appInsightsServiceSpy: { logEvent: jasmine.Spy };
  let assessmentServiceSpy: {};
  let httpClientSpy: { post: jasmine.Spy };
  let service: EligibilityService;

  beforeEach(() => {
    analyticsServiceSpy = jasmine.createSpyObj('analyticsServiceSpy', [
      'getSessionId'
    ]);
    appInsightsServiceSpy = jasmine.createSpyObj('AppInsightsService', [
      'logEvent'
    ]);
    assessmentServiceSpy = {};
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    service = new EligibilityService(
      <any>analyticsServiceSpy,
      <any>appInsightsServiceSpy,
      <any>assessmentServiceSpy,
      <any>httpClientSpy
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected response', () => {
    const testResponse: GatewayResponse = MOCK_ASSESSMENT_ELIGIBLE_NODISRUPTION;
    httpClientSpy.post.and.returnValue(of(testResponse));
    service
      .searchEligibility({ lastName: 'Last-name', ticket: '1234567890123' }, '')
      .subscribe((response) => {
        expect(response).toEqual(testResponse);
        expect(appInsightsServiceSpy.logEvent.calls.count()).toBe(
          1,
          'logEvent was called once'
        );
      });
  });

  it('should set gateway request with Ticket Number', () => {
    const form: SearchForm = {
      ticket: '1234567890123',
      lastName: 'test last name'
    };

    const gatewayReq = service.getBodyRequest(form, '');
    expect(gatewayReq.eligibilityRequest.ticketNumber).toEqual(form.ticket);
    expect(gatewayReq.eligibilityRequest.lastName).toEqual(form.lastName);
  });
});
