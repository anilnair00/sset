import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OriginDestinationGatewayResponse } from '../../models/api-gateway.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  assessmentCode: string = '';
  claims: Claim[] = [];
  itineraries: OriginDestinationGatewayResponse[] = [];

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    this.assessmentService.assessmentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.itineraries = result.originDestination));

    this.assessmentService
      .getAssessmentCode$()
      .subscribe((value) => (this.assessmentCode = value.code));

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => (this.claims = [...result]));

    this.assessmentService.manualFlow = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
