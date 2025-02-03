import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModalComponent } from './error-modal.component';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;

  const bsModalServiceSpy = jasmine.createSpyObj(['setDismissReason']);
  const bsModalRefSpy = jasmine.createSpyObj(['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      imports: [ModalModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: BsModalService, use: bsModalServiceSpy },
        { provide: BsModalRef, use: bsModalRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
