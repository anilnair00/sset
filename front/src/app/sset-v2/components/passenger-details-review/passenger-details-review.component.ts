import { AssessmentService } from '../../services/assessment/assessment.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Passenger } from '../../models/passenger.interface';
import { PassengerDetailsService } from '../../services/passenger-details/passenger-details.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-passenger-details-review',
  templateUrl: './passenger-details-review.component.html',
  styleUrls: ['./passenger-details-review.component.scss']
})
export class PassengerDetailsReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  passengers: Passenger[];
  isManualFlow: boolean;

  constructor(
    private assessmentService: AssessmentService,
    private passengerDetailsService: PassengerDetailsService) {}

  ngOnInit(): void {
    this.passengerDetailsService.passengerDetailsList$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((passengers: Passenger[]) => {
        this.passengers = passengers.filter((p) => p.isSelected);
      });

    this.assessmentService.manualFlow$
      ?.pipe(take(1))
      .subscribe((value) => (this.isManualFlow = value));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
