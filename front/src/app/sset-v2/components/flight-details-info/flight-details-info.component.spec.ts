import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightDetailsInfoComponent } from './flight-details-info.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateCutPipe } from 'src/app/shared/pipes/translate-cut.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('FlightDetailsInfoComponent', () => {
  let component: FlightDetailsInfoComponent;
  let fixture: ComponentFixture<FlightDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightDetailsInfoComponent, TranslateCutPipe],
      imports: [TranslateModule.forRoot(), HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
