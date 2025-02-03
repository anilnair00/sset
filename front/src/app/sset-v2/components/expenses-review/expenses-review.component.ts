import { AssessmentService } from '../../services/assessment/assessment.service';
import { Component, Input } from '@angular/core';
import { ExpenseDetails } from '../../models/expense.interface';
import { take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expenses-review',
  templateUrl: './expenses-review.component.html',
  styleUrls: ['./expenses-review.component.scss']
})
export class ExpensesReviewComponent {
  @Input() expenses: ExpenseDetails[];
  @Input() index: number;

  claimsLength: number = 0;

  constructor(
    private translate: TranslateService,
    public assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.assessmentService.addedClaims$
      .pipe(take(1))
      .subscribe(
        (claims) =>
          (this.claimsLength = claims.filter(
            (c) =>
              c.isClaimingCompensation || (c.expenses && c.expenses.length > 0)
          ).length)
      );
  }

  countAccommodationNights(checkInDate: string, checkOutDate: string): string {
    const fromDate = new Date(checkInDate);
    const toDate = new Date(checkOutDate);

    const diffInMs = toDate.getTime() - fromDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const nights = Math.floor(diffInDays);
    const nightsText =
      nights > 1
        ? ' ' +
          this.translate.instant('SSET_V2.ASSESSMENT.EXPENSE_DETAILS.NIGHTS')
        : ' ' +
          this.translate.instant('SSET_V2.ASSESSMENT.EXPENSE_DETAILS.NIGHT');
    return nights + nightsText;
  }
}
