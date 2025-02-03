import { EligibilityService } from './eligibility.service';
import { of } from 'rxjs';
import { ISearchForm } from '../models/search-form.interface';
import { EligibilityStatus } from '../models/eligibility-status.enum';
import { IGatewayResponse } from '../models/api-gateway.interface';

describe('EligibilityService', () => {
  let service: EligibilityService;
  let httpClientSpy: { post: jasmine.Spy };
  let appInsightsServiceSpy: { logEvent: jasmine.Spy };
  let analyticsServiceSpy: { getSessionId: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    appInsightsServiceSpy = jasmine.createSpyObj('AppInsightsService', [
      'logEvent'
    ]);
    analyticsServiceSpy = jasmine.createSpyObj('analyticsServiceSpy', [
      'getSessionId'
    ]);
    service = new EligibilityService(
      <any>httpClientSpy,
      <any>appInsightsServiceSpy,
      <any>analyticsServiceSpy
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected response', () => {
    const testResponse: IGatewayResponse = {
      eligibilityResponse: {
        statusDescription: EligibilityStatus.ELIGIBLE,
        statusCode: 10
      }
    };

    httpClientSpy.post.and.returnValue(of(testResponse));

    service
      .searchEligibility(
        {
          pnrTicket: 'TEST01',
          firstName: 'First-name',
          lastName: 'Last-name',
          date: '2020-03-01'
        },
        ''
      )
      .subscribe((response) => {
        expect(response).toEqual(testResponse);
        expect(appInsightsServiceSpy.logEvent.calls.count()).toBe(
          1,
          'logEvent was called once'
        );
      });
  });

  it('should set gateway request with PNR', () => {
    const form: ISearchForm = {
      pnrTicket: 'MOCKEL',
      firstName: 'test first name',
      lastName: 'test last name',
      date: '2020-03-25'
    };

    const gatewayReq = service.getBodyRequest(form, '');
    expect(gatewayReq.eligibilityRequest.pnr).toEqual(form.pnrTicket);
    expect(gatewayReq.eligibilityRequest.ticketNumber).toEqual(undefined);
    expect(gatewayReq.eligibilityRequest.firstName).toEqual(form.firstName);
    expect(gatewayReq.eligibilityRequest.lastName).toEqual(form.lastName);
    expect(gatewayReq.eligibilityRequest.flightDate).toEqual('2020-03-25');
  });

  it('should set gateway request with Ticket Number', () => {
    const form: ISearchForm = {
      pnrTicket: '1234567890123',
      firstName: 'test first name',
      lastName: 'test last name',
      date: '2020-03-25'
    };

    const gatewayReq = service.getBodyRequest(form, '');
    expect(gatewayReq.eligibilityRequest.pnr).toEqual(undefined);
    expect(gatewayReq.eligibilityRequest.ticketNumber).toEqual(form.pnrTicket);
    expect(gatewayReq.eligibilityRequest.firstName).toEqual(form.firstName);
    expect(gatewayReq.eligibilityRequest.lastName).toEqual(form.lastName);
    expect(gatewayReq.eligibilityRequest.flightDate).toEqual('2020-03-25');
  });
});
