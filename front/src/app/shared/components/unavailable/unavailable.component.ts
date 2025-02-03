import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-unavailable',
  templateUrl: './unavailable.component.html',
  styleUrls: ['./unavailable.component.scss']
})
export class UnavailableComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((p) => p.get('lang')))
      .subscribe((lang: string) => {
        if (this.translate.langs.indexOf(lang) > -1) {
          // Retrieve param from route and set lang if exists
          this.translate.use(lang);
        } else {
          // If lang is not supported, redirect to default lang
          this.router.navigateByUrl(
            '/' + this.translate.defaultLang + '/unavailable'
          );
        }
      });
  }
}
