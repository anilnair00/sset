import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaintenanceModeService } from './shared/services/maintenance-mode.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  loading = true;
  maintenanceMode: boolean;
  title = 'ac-web-sset';

  constructor(
    private maintenanceModeService: MaintenanceModeService,
    private router: Router,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    translate.addLangs(['en', 'fr']);
  }

  ngOnInit(): void {
    this.maintenanceModeService
      .getMaintenanceMode()
      .pipe(take(1))
      .subscribe((mm) => {
        this.loading = false;
        this.maintenanceMode = mm;
        this.translate.onLangChange
          .pipe(takeUntil(this.destroy$))
          .subscribe((e) => {
            if (mm) {
              this.router.navigateByUrl('/' + e.lang + '/unavailable');
            }
            document.documentElement.setAttribute('lang', e.lang);
            document.title = this.translate.instant('SSET.TAB_TITLE');
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
