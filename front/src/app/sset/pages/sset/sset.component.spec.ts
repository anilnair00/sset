// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { SsetComponent } from './sset.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { Router, RouterModule, Routes } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SsetStoreService } from '../../sset-store.service';
// import { EMPTY } from 'rxjs';
// import { DeviceService } from 'src/app/shared/services/device.service';
// import { AnalyticsService } from '../../services/analytics.service';
// import { TranslateCutPipe } from 'src/app/shared/pipes/translate-cut.pipe';
// import { SharedModule } from 'src/app/shared/shared.module';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { routes } from 'src/app/app-routing.module';

// describe('SsetComponent', () => {
//   let component: SsetComponent;
//   let fixture: ComponentFixture<SsetComponent>;
//   let router: Router;
//   let testRoutes = [...routes, { path: 'en/unavailable', component: SsetComponent, pathMatch: "full" }, { path: 'undefined', component: SsetComponent }];

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule.withRoutes(testRoutes as Routes), TranslateModule.forRoot(), SharedModule],
//       declarations: [SsetComponent],
//       providers: [
//         { provide: SsetStoreService, useClass: StoreSpy },
//         { provide: DeviceService, useClass: DeviceSpy },
//         { provide: AnalyticsService, useClass: AnalyticsServiceSpy },
//         HttpClient,
//         HttpHandler
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     router = TestBed.inject(Router);
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SsetComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

// class StoreSpy {
//   result$ = EMPTY;
//   timeoutError$ = EMPTY;
//   error$ = EMPTY;
// }

// class DeviceSpy {
//   search = jasmine.createSpy('search').and.callFake(() => undefined);
// }

// class AnalyticsServiceSpy {
//   pageView = jasmine.createSpy('pageView').and.callFake(() => undefined);
// }
