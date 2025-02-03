import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  private assetsImgFolder = '/assets/img/';
  acStarImgPath = this.assetsImgFolder + 'ac-star-en.svg';
  skytraxImgPath = this.assetsImgFolder + 'skytrax-en.svg';
  now = new Date();
  lang = this.translate.currentLang;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private translate: TranslateService) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.setLocalizedContent(this.translate.currentLang);
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.setLocalizedContent(e.lang));
  }

  setLocalizedContent(lang: string) {
    this.lang = lang;
    switch (lang) {
      case 'fr':
        this.acStarImgPath = this.assetsImgFolder + 'ac-star-fr.svg';
        this.skytraxImgPath = this.assetsImgFolder + 'skytrax-fr.svg';
        break;
      case 'es':
      case 'en':
      default:
        this.acStarImgPath = this.assetsImgFolder + 'ac-star-en.svg';
        this.skytraxImgPath = this.assetsImgFolder + 'skytrax-en.svg';
    }
  }
}
