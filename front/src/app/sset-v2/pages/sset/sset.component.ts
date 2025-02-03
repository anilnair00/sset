import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DeviceService } from '../../../shared/services/device.service';
import { Error } from '../../constants/error';
import { map, takeUntil } from 'rxjs/operators';
import { SsetStoreService } from '../../sset-store.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sset',
  templateUrl: './sset.component.html',
  styleUrls: ['./sset.component.scss']
})
export class SsetComponent implements OnInit, OnDestroy {
  @ViewChild('errorScrollTarget') errorScrollTarget;
  @ViewChild('passengerEligibilityContainer') passengerEligibilityContainer;
  @ViewChild('searchFormContainer') searchFormContainer;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  error?: Error;
  isMobileOrTablet: boolean;
  result: any;

  constructor(
    private analyticsService: AnalyticsService,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public store: SsetStoreService
  ) {}

  ngOnInit(): void {
    this.isMobileOrTablet =
      this.deviceService.isMobile || this.deviceService.isTablet;

    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          this.translate.use(lang);
        } else {
          this.router.navigateByUrl('/' + this.translate.defaultLang);
        }
      });

    this.store.result$.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.result = r;
      if (!!this.result && this.isMobileOrTablet) {
        setTimeout(() => {
          if (
            this.passengerEligibilityContainer &&
            this.passengerEligibilityContainer.nativeElement
          ) {
            this.passengerEligibilityContainer.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        });
      }
    });

    this.store.error$.pipe(takeUntil(this.destroy$)).subscribe((e) => {
      this.error = e;
      setTimeout(() => {
        if (this.errorScrollTarget && this.errorScrollTarget.nativeElement) {
          this.errorScrollTarget.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      });
    });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => {
        this.router.navigateByUrl('/' + e.lang);
        document.documentElement.setAttribute('lang', e.lang);
        document.title = this.translate.instant('SSET_V2.TAB_TITLE');
      });

    this.analyticsService.pageView();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onTryAgainClick(): void {
    setTimeout(() => {
      this.searchFormContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    });
  }
}
