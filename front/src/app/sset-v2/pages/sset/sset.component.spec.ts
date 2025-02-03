import { AnalyticsService } from '../../services/analytics/analytics.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceService } from '../../../shared/services/device.service';
import { EMPTY } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../../app/app-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SsetComponent } from './sset.component';
import { SsetStoreService } from '../../sset-store.service';
import { TranslateModule } from '@ngx-translate/core';
import { UnavailableComponent } from '../../../..//app/shared/components/unavailable/unavailable.component';

describe('SsetComponent', () => {
  let component: SsetComponent;
  let fixture: ComponentFixture<SsetComponent>;
  let router: Router;
  let testRoutes = [
    ...routes,
    { path: 'en/unavailable', component: SsetComponent, pathMatch: 'full' },
    { path: 'undefined', component: UnavailableComponent }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testRoutes as Routes),
        SharedModule,
        TranslateModule.forRoot()
      ],
      declarations: [SsetComponent],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceSpy },
        { provide: DeviceService, useClass: DeviceSpy },
        { provide: SsetStoreService, useClass: StoreSpy },
        HttpClient,
        HttpHandler
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class AnalyticsServiceSpy {
  pageView = jasmine.createSpy('pageView').and.callFake(() => undefined);
}

class DeviceSpy {
  search = jasmine.createSpy('search').and.callFake(() => undefined);
}

class StoreSpy {
  result$ = EMPTY;
  timeoutError$ = EMPTY;
  error$ = EMPTY;
}
