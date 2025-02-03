import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpModalComponent } from './help-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

describe('HelpModalComponent', () => {
  let component: HelpModalComponent;
  let fixture: ComponentFixture<HelpModalComponent>;

  const modalRefSpy = jasmine.createSpyObj(['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpModalComponent],
      imports: [TranslateModule.forRoot(), ModalModule.forRoot()],
      providers: [{ provide: BsModalRef, use: modalRefSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
