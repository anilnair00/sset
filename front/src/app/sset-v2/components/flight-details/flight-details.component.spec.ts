import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightDetailsComponent } from './flight-details.component';
import { HttpClientModule } from '@angular/common/http';

describe('FlightDetailsComponent', () => {
  let component: FlightDetailsComponent;
  let fixture: ComponentFixture<FlightDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightDetailsComponent],
      imports: [HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
