import { AnalyticsService } from './services/analytics/analytics.service';
import { EligibilityService } from './services/eligibility/eligibility.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { SsetStoreService } from './sset-store.service';
import { TestBed } from '@angular/core/testing';

describe('SsetStoreService', () => {
  let service: SsetStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceSpy },
        { provide: EligibilityService, useClass: EligibilityServiceSpy },
        { provide: ReCaptchaV3Service, useClass: RecaptchaServiceSpy }
      ]
    });
    service = TestBed.inject(SsetStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

class AnalyticsServiceSpy {}

class EligibilityServiceSpy {}

class RecaptchaServiceSpy {}
