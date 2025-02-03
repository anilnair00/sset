import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ReviewClaimsComponent } from './review-claims.component';
import { TranslateCutPipe } from 'src/app/shared/pipes/translate-cut.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('ReviewClaimsComponent', () => {
  let component: ReviewClaimsComponent;
  let fixture: ComponentFixture<ReviewClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [ReviewClaimsComponent, TranslateCutPipe],
      providers: [
        { provide: AssessmentService, useClass: AssessmentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class AssessmentServiceSpy {
  addedClaims$: Observable<Claim[]> = of([]);
}
