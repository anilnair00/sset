import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim, Flight } from '../../models/assessment.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  getMonthDayYear,
  getMonthDayYearFrench
} from '../../../shared/helpers/date.helper';
import { Subject, map, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flight-added',
  templateUrl: './flight-added.component.html',
  styleUrls: ['./flight-added.component.scss']
})
export class FlightAddedComponent implements OnInit, OnDestroy {
  @Input() claim: Claim;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  addedClaims: Claim[] = [];
  claimAdded: boolean = false;
  date: string = '';
  flightLeg: Flight;

  constructor(
    private route: ActivatedRoute,
    public assessmentService: AssessmentService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.flightLeg = {
      ...this.claim.flights[0],
      bookingReference: this.claim.pnrNumber
    };
    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        if (lang === 'en') {
          this.date = getMonthDayYear(this.flightLeg.scheduledDepartureDate);
        } else if (lang === 'fr') {
          this.date = getMonthDayYearFrench(
            this.flightLeg.scheduledDepartureDate.replace(/\//g, '-')
          );
        }
      });
    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((c) => (this.addedClaims = [...c]));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  removeClaim(): void {
    this.addedClaims = this.addedClaims.filter(
      (c) => c.assessmentId !== this.claim.assessmentId
    );
    this.claimAdded = false;
    this.assessmentService.addClaims = this.addedClaims;
  }
}
