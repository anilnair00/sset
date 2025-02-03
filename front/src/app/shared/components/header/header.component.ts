import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { IMenuItem } from '../../models/menu-item.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() nav = true;
  @Input() userData?: any;

  private routeUrl: string;

  isCollapsed = true;
  isMobile: boolean;

  logoPath: string;
  title: string;
  langs: string[];
  menuItems: IMenuItem[];
  showLangMenu: boolean = true;

  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('collapse') collapse;
  @HostListener('window:resize') onResize() {
    this.setIsMobile();
  }

  constructor(
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private _er: ElementRef
  ) {
    // Disabled nav if route contains data { nav: false }. e.g. on not supported browser route.
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.routeUrl = e['url'];
        this.showLangMenu = ['/', '/en', '/fr'].includes(this.routeUrl);
        if (
          route.root.firstChild &&
          route.root.firstChild.snapshot &&
          route.root.firstChild.snapshot.data
        ) {
          this.nav = route.root.firstChild.snapshot.data['nav'] !== false;
        }
      });
  }

  ngOnInit() {
    this.setIsMobile();

    this.headerService.logo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (lp) =>
          (this.logoPath =
            lp && lp.length ? lp : this.headerService.default.logo)
      );

    this.headerService.title$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (t) =>
          (this.title = t && t.length ? t : this.headerService.default.title)
      );

    this.headerService.menu$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (m) =>
          (this.menuItems =
            m && m.length ? m : this.headerService.default.menuItems)
      );

    this.headerService.langs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (l) =>
          (this.langs = l && l.length ? l : this.headerService.default.langs)
      );
  }

  setIsMobile() {
    this.isMobile = window.innerWidth < 992;
  }

  focusCloseBtn(id, event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }
    document.getElementById(id).focus();
  }

  onCloseMobileMenu() {
    document.getElementById('nav-toggler').focus();
  }

  onStepIntoLangMenu() {
    const langOptions = document.getElementsByClassName('lang-dropdown-item');
    if (langOptions.length) {
      document.getElementById(langOptions[0].id).focus();
    }
  }

  onNavigateLangOptions(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      document.getElementById('lang-dropdown-btn').focus();
    } else {
      const langOptions = document.querySelectorAll('.lang-dropdown-item');
      const langOptionIds = [];
      langOptions.forEach((item) => langOptionIds.push(item.id));
      this.focusNextListItem(event.key, langOptionIds);
    }
  }

  focusNextListItem(key: string, langOptionIds: string[]) {
    const activeItemId = document.activeElement.id;
    const activeItemIndex = langOptionIds.indexOf(activeItemId);

    if (key === 'ArrowDown' || key === 'Down') {
      if (activeItemIndex < langOptionIds.length - 1) {
        const nextListItemId = langOptionIds[activeItemIndex + 1];
        document.getElementById(nextListItemId).focus();
      }
    } else if (key === 'ArrowUp' || key === 'Up') {
      if (activeItemIndex > 0) {
        const nextListItemId = langOptionIds[activeItemIndex - 1];
        document.getElementById(nextListItemId).focus();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  logout() {
    this.router.navigateByUrl('/logout', { skipLocationChange: true });
  }

  onLogoClick() {
    window.location.href = '/';
  }

  getLanguage(lang: string): string {
    if (!lang) {
      return '';
    }
    return this.translate.instant('SHARED.LANGUAGE.' + lang.toUpperCase());
  }

  @HostListener('document:click', ['$event']) onClick(event): void {
    if (!this.isCollapsed && !this._er.nativeElement.contains(event.target)) {
      this.isCollapsed = true;
    }
  }
}
