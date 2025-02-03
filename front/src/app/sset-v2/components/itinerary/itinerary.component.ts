import { AssessmentService } from '../../services/assessment/assessment.service';
import {
  Claim,
  EligibilityResponseInterface,
  Flight
} from '../../models/assessment.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EligibilityStatus } from '../../constants/eligibility';
import { getEligibilityCodeInfo } from '../../helpers/eligibilityResponse.helper';
import { OriginDestinationGatewayResponse } from '../../models/api-gateway.interface';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, OnDestroy {
  @Input() itinerary: OriginDestinationGatewayResponse;
  @Input() index: number;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  addedClaims: Claim[] = [];
  claimAdded: boolean = false;
  eligibilityResponse: EligibilityResponseInterface;
  flightLegs: Flight[] = [];
  isEligible: boolean = false;
  pnrNumber: string;

  constructor(
    public assessmentService: AssessmentService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.eligibilityResponse = getEligibilityCodeInfo(this.itinerary);

    this.assessmentService.assessmentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.flightLegs = this.itinerary?.flights.map((f) => {
          return {
            ...f,
            bookingReference: data.pnrNumber
          };
        });
      });

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims) => {
        this.addedClaims = [...claims];
        const addedToClaimIndex = this.addedClaims.findIndex((c) => {
          return (
            c.assessmentId === this.itinerary.assessmentId &&
            c.isClaimingCompensation
          );
        });
        this.claimAdded = addedToClaimIndex > -1;
      });

    this.isEligible =
      this.eligibilityResponse?.compensationEligibilityStatus ===
      EligibilityStatus.Eligible;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  addToClaim(): void {
    this.addedClaims = this.addedClaims.map((c) => {
      if (c.assessmentId === this.itinerary.assessmentId) {
        return {
          ...c,
          isClaimingCompensation: true
        };
      }
      return c;
    });
    this.assessmentService.addClaims = this.addedClaims;
  }

  removeClaim(): void {
    this.addedClaims = this.addedClaims.map((c) => {
      if (c.assessmentId === this.itinerary.assessmentId) {
        return {
          ...c,
          isClaimingCompensation: false
        };
      }
      return c;
    });
    this.claimAdded = false;
    this.assessmentService.addClaims = [...this.addedClaims];
  }
}
