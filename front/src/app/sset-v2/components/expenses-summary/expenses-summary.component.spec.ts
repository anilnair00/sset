import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesSummaryComponent } from './expenses-summary.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

describe('ExpensesSummaryComponent', () => {
  let component: ExpensesSummaryComponent;
  let fixture: ComponentFixture<ExpensesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesSummaryComponent],
      imports: [HttpClientModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
