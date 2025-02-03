import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesComponent } from './expenses.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('ExpensesComponent', () => {
  const bsModalRefSpy = jasmine.createSpyObj(['hide']);
  const bsModalServiceSpy = jasmine.createSpyObj(['setDismissReason']);
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensesComponent],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot(),
        RouterModule.forRoot([]),
        ModalModule.forRoot()
      ],
      providers: [
        { provide: BsModalService, use: bsModalServiceSpy },
        { provide: BsModalRef, use: bsModalRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
