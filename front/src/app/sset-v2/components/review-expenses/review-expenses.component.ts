import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { Component, Input, OnInit } from '@angular/core';
import { PassengerDetailsService } from '../../services/passenger-details/passenger-details.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-review-expenses',
  templateUrl: './review-expenses.component.html',
  styleUrls: ['./review-expenses.component.scss']
})
export class ReviewExpensesComponent implements OnInit {
  @Input() addedClaims: Claim[];

  isAcknowledgementAgreed: boolean = false;
  isAcknowledgementChecked: boolean = true;
  isExpenseReview: boolean = true;
  isPermissionChecked: boolean = true;
  isPermissionsAgreed: boolean = false;
  isManualFlow: boolean = false;
  hasMultiplePassengers: boolean = false;

  constructor(
    private assessmentService: AssessmentService,
    private passengerDetailsService: PassengerDetailsService
  ) {}

  ngOnInit(): void {
    this.assessmentService.manualFlow$
      .pipe(take(1))
      .subscribe((value) => (this.isManualFlow = value));

    this.passengerDetailsService.passengerDetailsList$
      .pipe(take(1))
      .subscribe((passengerDetailsList) => {
        this.hasMultiplePassengers =
          passengerDetailsList.filter((p) => p.isSelected).length > 1;
      });
  }

  getExpenseClaims(): Claim[] {
    if (this.addedClaims) {
      return this.addedClaims.filter(
        (c) => c?.expenses && c.expenses?.length > 0
      );
    }
    return [];
  }

  onIsAcknowledgementAgreedClicked(): void {
    this.isAcknowledgementAgreed = !this.isAcknowledgementAgreed;
    this.isAcknowledgementChecked = true;
  }

  onIsPermissionsAgreedClicked(): void {
    this.isPermissionsAgreed = !this.isPermissionsAgreed;
    this.isPermissionChecked = true;
  }

  onSubmit(): boolean {
    if (
      this.hasMultiplePassengers &&
      (!this.isAcknowledgementAgreed || !this.isPermissionsAgreed)
    ) {
      if (!this.isAcknowledgementAgreed) {
        this.isAcknowledgementChecked = false;
      }
      if (!this.isPermissionsAgreed) {
        this.isPermissionChecked = false;
      }
      return false;
    }
    return true;
  }
}
