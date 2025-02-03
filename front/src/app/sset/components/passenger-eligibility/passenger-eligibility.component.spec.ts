import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerEligibilityComponent } from './passenger-eligibility.component';
import { SsetStoreService } from '../../sset-store.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EMPTY } from 'rxjs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IEligibilityResponse } from '../../models/api-gateway.interface';
import { EligibilityStatus } from '../../models/eligibility-status.enum';

describe('PassengerEligibilityComponent', () => {
  let component: PassengerEligibilityComponent;
  let fixture: ComponentFixture<PassengerEligibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassengerEligibilityComponent],
      imports: [TranslateModule.forRoot(), ModalModule.forRoot()],
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

  it('should set reason with delay', () => {
    const r: IEligibilityResponse = {
      statusCode: 10,
      statusDescription: EligibilityStatus.ELIGIBLE,
      arrivalDelayIATACode: 2
    };

    component.setEligibility(r);

    fixture.detectChanges();

    expect(component.reason).toBe(r.arrivalDelayIATACode.toString());
  });

  it('should set reason with cancellation', () => {
    const r: IEligibilityResponse = {
      statusCode: 10,
      statusDescription: EligibilityStatus.ELIGIBLE,
      secondaryCancellationReasonCode: 'FOC'
    };

    component.setEligibility(r);

    fixture.detectChanges();

    expect(component.reason).toBe(r.secondaryCancellationReasonCode);
  });
});

class StoreSpy {
  result$ = EMPTY;
}
