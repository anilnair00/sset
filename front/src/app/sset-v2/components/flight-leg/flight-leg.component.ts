import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Flight } from '../../models/assessment.interface';
import {
  getHHMM,
  getMonthDayYear,
  getMonthDayYearFrench
} from '../../../../app/shared/helpers/date.helper';
import { Subject, map, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-flight-leg',
  templateUrl: './flight-leg.component.html',
  styleUrls: ['./flight-leg.component.scss']
})
export class FlightLegComponent implements OnInit, OnDestroy {
  @Input() flightLeg: Flight;
  @Input() lastChild: boolean;
  @Input() showSeperatorAlways: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  airlineName: string = '';
  arrivalAirportCode: string = '';
  arrivalCity: string = '';
  arrivalTime: string = '';
  date: string = '';
  departureAirportCode: string = '';
  departureCity: string = '';
  departureTime: string = '';
  flightNumber: string = '';
  isManualFlow: boolean = false;

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.airlineName = this.setAirlineNameValue();
    this.arrivalAirportCode = this.flightLeg?.scheduledArrivalAirport;
    this.arrivalCity = this.flightLeg?.scheduledArrivalAirportCityName;
    this.arrivalTime = getHHMM(this.flightLeg?.scheduledArrivalTime);
    this.date = getMonthDayYear(this.flightLeg?.scheduledDepartureDate);
    this.departureAirportCode = this.flightLeg?.scheduledDepartureAirport;
    this.departureCity = this.flightLeg?.scheduledDepartureAirportCityName;
    this.departureTime = getHHMM(this.flightLeg?.scheduledDepartureTime);
    this.flightNumber =
      this.flightLeg?.airlineCarrierCode + this.flightLeg?.flightNumber;

    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        if (lang === 'en') {
          this.date = getMonthDayYear(this.flightLeg?.scheduledDepartureDate);
        } else if (lang === 'fr') {
          this.date = getMonthDayYearFrench(
            this.flightLeg?.scheduledDepartureDate.split('T')[0]
          );
        }
      });

    this.assessmentService.manualFlow$
      .pipe(take(1))
      .subscribe((value) => (this.isManualFlow = value));
  }

  setAirlineNameValue(): string {
    return this.flightLeg?.airlineName == 'AirCanada'
      ? '(Air Canada)'
      : this.flightLeg?.airlineName;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
