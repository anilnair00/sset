import { tap, map, takeUntil, filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SsetStoreService } from '../../sset-store.service';
import { Subject } from 'rxjs';
import { ErrorType } from '../../models/error.enum';
import { DeviceService } from '../../../shared/services/device.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-sset',
  templateUrl: './sset.component.html',
  styleUrls: ['./sset.component.scss']
})
export class SsetComponent implements OnInit, OnDestroy {
  result: any;
  error?: ErrorType;
  isMobileOrTablet: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('scrollTarget') scrollTarget;
  @ViewChild('errorScrollTarget') errorScrollTarget;
  @ViewChild('formScrollTarget') formScrollTarget;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    public store: SsetStoreService,
    private deviceService: DeviceService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.isMobileOrTablet =
      this.deviceService.isMobile || this.deviceService.isTablet;

    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          // Retrieve param from route and set lang if exists
          this.translate.use(lang);
        } else {
          // If lang is not supported, redirect to default lang
          this.router.navigateByUrl('/v1/' + this.translate.defaultLang);
        }
      });

    this.store.result$.pipe(takeUntil(this.destroy$)).subscribe((r) => {
      this.result = r;
      // Hack to wait for next template iteration

      if (!!this.result && this.isMobileOrTablet) {
        setTimeout(() => {
          if (this.scrollTarget && this.scrollTarget.nativeElement) {
            this.scrollTarget.nativeElement.scrollIntoView({
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
      // Hack to wait for next template iteration
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
        this.router.navigateByUrl('/v1/' + e.lang);
        document.documentElement.setAttribute('lang', e.lang);
        document.title = this.translate.instant('SSET.TAB_TITLE');
      });

    this.analyticsService.pageView();
  }

  onTryAgainClick() {
    setTimeout(() => {
      this.formScrollTarget.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
