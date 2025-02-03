import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { Component, OnInit } from '@angular/core';
import { Pages } from '../../constants/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-review-claims',
  templateUrl: './review-claims.component.html',
  styleUrls: ['./review-claims.component.scss']
})
export class ReviewClaimsComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  addedClaims: Claim[];
  Pages = Pages;

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    const assessmentDomElement = document.getElementById(
      'assessmentPageContainer'
    );
    if (assessmentDomElement) {
      assessmentDomElement.scrollIntoView({ behavior: 'smooth' });
    }
    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((addedClaims) => {
        if (addedClaims && addedClaims.length) {
          this.addedClaims = [...addedClaims].sort(
            (c1, c2) => c1.index - c2.index
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getFilteredClaims(): Claim[] {
    if (this.addedClaims) {
      return this.addedClaims.filter(
        (c) => c.isClaimingCompensation || (c.expenses && c.expenses.length > 0)
      );
    }
    return [];
  }

  onClickNavigateToPage(page: string): void {
    if (page === Pages.Expenses) {
      this.assessmentService.claimIndex = 0;
    }
    this.assessmentService.setAssessmentPage$(page);
  }
}
