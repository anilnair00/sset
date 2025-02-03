import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PassengerEligibilityComponent } from './passenger-eligibility.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../../../app/app-routing.module';
import { Routes } from '@angular/router';
import { SsetStoreService } from '../../sset-store.service';
import { TranslateModule } from '@ngx-translate/core';
import { UnavailableComponent } from '../../../../app/shared/components/unavailable/unavailable.component';

describe('PassengerEligibilityComponent', () => {
  let component: PassengerEligibilityComponent;
  let fixture: ComponentFixture<PassengerEligibilityComponent>;
  let testRoutes = [
    ...routes,
    { path: 'en', component: PassengerEligibilityComponent, pathMatch: 'full' },
    { path: 'undefined', component: UnavailableComponent }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes(testRoutes as Routes)
      ],
      declarations: [PassengerEligibilityComponent],
      providers: [{ provide: SsetStoreService, useClass: StoreSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class StoreSpy {
  result$ = EMPTY;
}
