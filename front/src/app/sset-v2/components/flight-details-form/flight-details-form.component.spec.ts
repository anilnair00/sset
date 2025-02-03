import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightDetailsFormComponent } from './flight-details-form.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('FlightDetailsFormComponent', () => {
  const bsModalRefSpy = jasmine.createSpyObj(['hide']);
  const bsModalServiceSpy = jasmine.createSpyObj(['setDismissReason']);
  let component: FlightDetailsFormComponent;
  let fixture: ComponentFixture<FlightDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightDetailsFormComponent],
      imports: [
        HttpClientModule,
        ModalModule.forRoot(),
        RouterModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: BsModalService, use: bsModalServiceSpy },
        { provide: BsModalRef, use: bsModalRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
