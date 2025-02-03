import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReviewExpensesComponent } from './review-expenses.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ReviewExpensesComponent', () => {
  let component: ReviewExpensesComponent;
  let fixture: ComponentFixture<ReviewExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewExpensesComponent],
      imports: [HttpClientModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
