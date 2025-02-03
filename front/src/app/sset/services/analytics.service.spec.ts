import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { TranslateModule } from '@ngx-translate/core';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()]
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
