import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ExpenseDetails } from '../../models/expense.interface';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-expenses-summary',
  templateUrl: './expenses-summary.component.html',
  styleUrls: ['./expenses-summary.component.scss']
})
export class ExpensesSummaryComponent implements OnInit, OnDestroy {
  @Input() expenseReviewIndex?: number;
  @Input() isExpenseReview?: boolean;
  @Output() onEditClicked = new EventEmitter<number>();

  private destroy$: Subject<boolean> = new Subject<boolean>();
  claims: Claim[];
  expenses: ExpenseDetails[];
  index: number;

  constructor(
    private translate: TranslateService,
    public assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims) => {
        if (this.isExpenseReview) {
          this.claims = [...claims].filter(
            (c) => c?.expenses && c?.expenses?.length > 0
          );
          this.expenses = this.claims[this.expenseReviewIndex]?.expenses;
        } else {
          this.claims = [...claims];
          this.expenses = this.claims[this.index]?.expenses;
        }
      });

    if (!this.isExpenseReview) {
      this.assessmentService.claimIndex$
        .pipe(takeUntil(this.destroy$))
        .subscribe((index) => {
          this.index = index;
          this.expenses = this.claims[index]?.expenses;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  onClickEdit(index: number): void {
    this.onEditClicked.emit(index);
  }
}
