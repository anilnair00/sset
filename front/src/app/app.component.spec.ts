import { AppComponent } from './app.component';
import { EMPTY, of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { MaintenanceModeService } from './shared/services/maintenance-mode.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { Routes, ɵEmptyOutletComponent } from '@angular/router';
import { SsetComponent } from './sset/pages/sset/sset.component';
import {
  TestBed,
  async,
  ComponentFixture,
  fakeAsync
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let testRoutes = [
    ...routes,
    { path: 'en/unavailable', component: SsetComponent, pathMatch: 'full' },
    { path: 'undefined', component: SsetComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testRoutes as Routes),
        TranslateModule.forRoot()
      ],
      declarations: [AppComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceSpy },
        {
          provide: MaintenanceModeService,
          useClass: MaintenanceModeServiceSpy
        },
        HttpClient,
        HttpHandler
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should redirect to "/en/unavailable" if maintenance mode is on', fakeAsync(() => {
    const maintenanceModeService = TestBed.inject(MaintenanceModeService);
    // const translateService = TestBed.inject(TranslateService);
    spyOn(maintenanceModeService, 'getMaintenanceMode').and.returnValue(
      of(true)
    );
    // spyOn(translateService, 'onLangChange').and.returnValue(of({ lang: 'en' }));
    let navigateSpy = spyOn(router, 'navigateByUrl');
    app.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith('/en/unavailable');
  }));

  // it('should redirect to "/en" if maintenance mode is off', fakeAsync(() => {
  //   const maintenanceModeService = TestBed.inject(MaintenanceModeService);
  //   // const translateService = TestBed.inject(TranslateService);
  //   spyOn(maintenanceModeService, 'getMaintenanceMode').and.returnValue(of(false));
  //   // spyOn(translateService, 'onLangChange').and.returnValue(of({ lang: 'en' }));
  //   let navigateSpy = spyOn(router, 'navigateByUrl');
  //   app.ngOnInit();
  //   expect(navigateSpy).toHaveBeenCalledWith('/en');
  // }));
});

class MaintenanceModeServiceSpy {
  getMaintenanceMode = () => of(EMPTY);
}

class TranslateServiceSpy {
  setDefaultLang = (lang: string) => {};
  addLangs = (langs: string[]) => {};
  instant = (text: string) => {};
  get onLangChange() {
    return of({ lang: 'en' });
  }
}
