import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { EligibilityStatus } from '../../constants/eligibility';
import { GatewayResponse } from '../../models/api-gateway.interface';
import { SsetStoreService } from '../../sset-store.service';
import { Subject } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-passenger-eligibility',
  templateUrl: './passenger-eligibility.component.html',
  styleUrls: ['./passenger-eligibility.component.scss']
})
export class PassengerEligibilityComponent implements OnInit, OnDestroy {
  @Output() tryAgain: EventEmitter<any> = new EventEmitter();
  @ViewChild('response') response: ElementRef;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  eligibilityStatus = EligibilityStatus;
  icon: {
    path?: string;
    title?: string;
  } = {};
  failures = 0;
  status: EligibilityStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public store: SsetStoreService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.store.result$.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.setEligibility(r);
      setTimeout(() => {
        if (this.response && this.response.nativeElement) {
          this.response.nativeElement.focus();
        }
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  goToAssessment(): void {
    this.router.navigate(['/assessment']);
    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.router.navigate(['/' + lang + '/assessment']);
        } else {
          this.router.navigate([
            '/' + this.translate.defaultLang + '/assessment'
          ]);
        }
      });
  }

  onSubmit(): void {
    this.store.requestForm$.pipe(take(1)).subscribe((f) => {
      this.goToAssessment();
    });
  }

  resetIcon(): void {
    const icon = { ...this.icon };
    this.icon = {};
    setTimeout(() => (this.icon = icon));
  }

  setEligibility(r: GatewayResponse): void {
    // in case of error 500 or no responses, hide the content and reset local state
    if (typeof r === 'undefined') {
      this.status = undefined;
      this.resetIcon();
      return;
    }

    // validation exception
    if (r.errorCode === 31) {
      this.status = undefined;
      this.resetIcon();
      return;
    }

    if (r.errorCode === 30) {
      this.status = EligibilityStatus.NoMatch;
      this.icon.title = 'WARNING';
      this.icon.path = 'icn-error-warning';
      this.failures++;
      this.resetIcon();
    }
  }
}
