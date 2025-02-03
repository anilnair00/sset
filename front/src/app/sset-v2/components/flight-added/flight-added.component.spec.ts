import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightAddedComponent } from './flight-added.component';
import { MOCK_ELIGIBLE_DISRUPTION } from '../../mocks/mock-eligibility.mock';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('FlightAddedComponent', () => {
  let component: FlightAddedComponent;
  let fixture: ComponentFixture<FlightAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightAddedComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AssessmentService, useClass: AssessmentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightAddedComponent);
    component = fixture.componentInstance;
    component.claim = {
      ...MOCK_ELIGIBLE_DISRUPTION,
      pnrNumber: 'A1B2C3',
      index: 0,
      isClaimingCompensation: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class AssessmentServiceSpy {
  addClaims = (itineraries: Claim[]) => {};
  addedClaims$: Observable<Claim[]> = of([]);
}
