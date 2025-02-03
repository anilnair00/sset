import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightLegComponent } from './flight-leg.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FlightLegComponent', () => {
  let component: FlightLegComponent;
  let fixture: ComponentFixture<FlightLegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightLegComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightLegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
