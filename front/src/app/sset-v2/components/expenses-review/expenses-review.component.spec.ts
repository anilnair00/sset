import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesReviewComponent } from './expenses-review.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('ExpensesReviewComponent', () => {
  let component: ExpensesReviewComponent;
  let fixture: ComponentFixture<ExpensesReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesReviewComponent],
      imports: [HttpClientModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
