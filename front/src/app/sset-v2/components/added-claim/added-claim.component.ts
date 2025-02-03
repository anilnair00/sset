import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Pages } from '../../constants/common';
import { take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-added-claim',
  templateUrl: './added-claim.component.html',
  styleUrls: ['./added-claim.component.scss']
})
export class AddedClaimComponent implements OnInit, OnChanges {
  @Input() claim: Claim;
  @Input() index: number;

  assessmentPage: string = '';
  claimsLength: number = 0;
  claimTypeText: string = '';

  constructor(
    private translate: TranslateService,
    public assessmentService: AssessmentService
  ) {}

  ngOnInit(): void {
    this.assessmentService
      .getAssessmentPage$()
      .pipe(take(1))
      .subscribe((page) => (this.assessmentPage = page));

    this.assessmentService.addedClaims$.pipe(take(1)).subscribe((claims) => {
      if (this.assessmentPage === Pages.ReviewExpenses) {
        this.claimsLength = claims.filter(
          (c) => c.expenses && c.expenses.length > 0
        ).length;
      } else if (
        this.assessmentPage === Pages.Confirmation ||
        this.assessmentPage === Pages.Incomplete ||
        this.assessmentPage === Pages.ReviewClaim
      ) {
        this.claimsLength = claims.filter(
          (c) =>
            c.isClaimingCompensation || (c?.expenses && c.expenses.length > 0)
        ).length;
      } else this.claimsLength = claims.length;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['index'] || changes['claim']) {
      if (
        this.claim.isClaimingCompensation &&
        this.claim?.expenses &&
        this.claim.expenses.length > 0
      ) {
        this.claimTypeText = this.translate.instant(
          'SSET_V2.ASSESSMENT.FLIGHT_DISRUPTION_EXPENSES'
        );
      } else if (this.claim.isClaimingCompensation) {
        this.claimTypeText = this.translate.instant(
          'SSET_V2.ASSESSMENT.FLIGHT_DISRUPTION'
        );
      } else if (this.claim?.expenses && this.claim.expenses.length > 0) {
        this.claimTypeText = this.translate.instant(
          'SSET_V2.ASSESSMENT.EXPENSES_ONLY'
        );
      } else {
        this.claimTypeText = '';
      }
    }
  }
}
