import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { Claim } from '../../models/assessment.interface';
import { Component } from '@angular/core';
import { Pages } from '../../constants/common';
import { SsetStoreService } from '../../sset-store.service';
import { Subject, map, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  addedClaims: Claim[];
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public assessmentService: AssessmentService,
    public store: SsetStoreService
  ) {}

  ngOnInit(): void {
    this.assessmentService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flag) => (this.error = flag));

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((addedClaims) => {
        if (addedClaims && addedClaims.length) {
          this.addedClaims = [...addedClaims].filter(
            (c) =>
              c.isClaimingCompensation || (c.expenses && c.expenses.length > 0)
          );
        } else {
          this.gotoHomepage();
        }
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.router.navigateByUrl('/' + e.lang + '/confirmation');
        document.documentElement.setAttribute('lang', e.lang);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.assessmentService.resetSearch$();
  }

  gotoHomepage(): void {
    this.store.result = undefined;
    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
          this.router.navigateByUrl('/' + lang);
        } else {
          this.router.navigateByUrl('/' + this.translate.defaultLang);
        }
      });
  }
}
