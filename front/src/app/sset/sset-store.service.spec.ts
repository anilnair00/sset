import { TestBed } from '@angular/core/testing';

import { SsetStoreService } from './sset-store.service';
import { EligibilityService } from './services/eligibility.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { AnalyticsService } from './services/analytics.service';

describe('SsetStoreService', () => {
  let service: SsetStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EligibilityService, useClass: EligibilityServiceSpy },
        { provide: ReCaptchaV3Service, useClass: RecaptchaServiceSpy },
        { provide: AnalyticsService, useClass: AnalyticsServiceSpy }
      ]
    });
    service = TestBed.inject(SsetStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

class EligibilityServiceSpy {}

class RecaptchaServiceSpy {}

class AnalyticsServiceSpy {}
