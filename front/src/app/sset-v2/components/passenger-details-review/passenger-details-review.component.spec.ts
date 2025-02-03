import { AssessmentService } from '../../services/assessment/assessment.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PassengerDetailsReviewComponent } from './passenger-details-review.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PassengerDetailsReviewComponent', () => {
  let component: PassengerDetailsReviewComponent;
  let fixture: ComponentFixture<PassengerDetailsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientModule],
      declarations: [PassengerDetailsReviewComponent],
      providers: [
        { provide: AssessmentService, useClass: AssessmentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerDetailsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class AssessmentServiceSpy {
  passengerDetails$: Observable<boolean> = of(true);
}
