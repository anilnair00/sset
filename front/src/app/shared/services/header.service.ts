import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IMenuItem } from '../models/menu-item.interface';
import { IHeaderConfig, ILogoPath } from '../models/header-config.interface';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  public readonly default = {
    title: 'Air Canada',
    logo: '/assets/img/ac-logo.svg',
    langs: ['en'],
    menuItems: []
  };

  private logoPaths: ILogoPath[] = undefined;

  private _menu: BehaviorSubject<IMenuItem[]> = new BehaviorSubject<
    IMenuItem[]
  >([]);
  menu$: Observable<IMenuItem[]> = this._menu.asObservable();

  private _logo: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.default.logo
  );
  logo$: Observable<string> = this._logo.asObservable();

  private _langs: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.default.langs
  );
  langs$: Observable<string[]> = this._langs.asObservable();

  private _title: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.default.title
  );
  title$: Observable<string> = this._title.asObservable();

  constructor(private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe((l) => {
      if (this.logoPaths && this.logoPaths.length) {
        const c = this.logoPaths.find((p) => p.lang === l.lang);
        this.setLogo(
          c && c.path ? c.path : this.logoPaths[0].path || undefined
        );
      }
    });
  }

  private setMenu(menuItems?: IMenuItem[]) {
    this._menu.next(
      menuItems && menuItems.length ? menuItems : this.default.menuItems
    );
  }

  private setLogo(logo?: string) {
    this._logo.next(logo && logo.length ? logo : this.default.logo);
  }

  private setLangs(langs?: string[]) {
    this._langs.next(langs && langs.length ? langs : this.default.langs);
  }

  private setTitle(title?: string) {
    this._title.next(title && title.length ? title : this.default.title);
  }

  setHeader(conf?: IHeaderConfig) {
    this.setMenu((conf && conf.menu) || undefined);

    this.logoPaths = undefined;
    if (conf && typeof conf.logo === 'string') {
      this.setLogo(conf.logo || undefined);
    } else if (conf && typeof conf.logo === 'object') {
      this.logoPaths = conf.logo;
      const c = conf.logo.find(
        (l) => l.lang === this.translateService.currentLang
      );
      this.setLogo(c ? c.path : undefined);
    } else {
      this.setLogo(undefined);
    }

    this.setLangs((conf && conf.langs) || undefined);
    this.setTitle((conf && conf.title) || undefined);
  }

  reset() {
    this.setHeader();
  }
}
