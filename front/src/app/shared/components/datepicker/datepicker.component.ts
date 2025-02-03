import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { frLocale, esLocale, zhCnLocale } from 'ngx-bootstrap/locale';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit, OnDestroy {
  @Input() formGroup: UntypedFormGroup;
  @Input() name: string;
  @Input() readonly = false;
  @Input() required = false;
  @Input() helperText?: string;
  @Input() inputFormat?: string;
  @Input() inputId?: string;
  @Input() invalidCustomText?: string;
  @Input() invalidFormatText?: string;
  @Input() label?: string;
  @Input() maxDate?: Date;
  @Input() minDate?: Date;
  @Input() requiredText?: string;
  @Input() value?: string;

  private bsValueChangeCounter = 0;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  bsConfig: BsDatepickerConfig;
  dateStr: string = '';
  dateValue: Date;
  disabledDates = [];
  focus = false;
  invalid = false;
  labelUp = false;
  placeholder?: string;
  touched = false;

  constructor(
    private localeService: BsLocaleService,
    public translate: TranslateService
  ) {
    esLocale.invalidDate = 'Fecha invalida';
    frLocale.invalidDate = 'Date invalide';
    zhCnLocale.invalidDate = '失效日期';
    defineLocale('es', esLocale);
    defineLocale('fr', frLocale);
    defineLocale('zh', zhCnLocale);
    defineLocale('zhcn', zhCnLocale);
  }

  ngOnInit() {
    // To ensure calendar follows field on scroll
    window.addEventListener('scroll', this.onScroll, true);

    this.setDatepickerConf();

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((p) => {
        this.setDatepickerConf(p.lang);
      });

    this.formGroup.controls[this.name].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        this.setDateValue(v);
      });

    if (this.formGroup.controls[this.name]) {
      this.setDateValue(this.formGroup.controls[this.name].value);
    }

    this.formGroup.controls[this.name].statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((st) => (this.invalid = st === 'INVALID'));
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  onFocus() {
    this.labelUp = true;
  }

  onKeyup(event) {
    this.dateStr = event.target.value;
  }

  onScroll(event) {}

  setCustomLocale() {
    enGbLocale.invalidDate = this.dateStr;
    esLocale.invalidDate = this.dateStr;
    frLocale.invalidDate = this.dateStr;
    zhCnLocale.invalidDate = this.dateStr;
    defineLocale('custom locale', enGbLocale);
    defineLocale('en', enGbLocale);
    defineLocale('es', esLocale);
    defineLocale('fr', frLocale);
    defineLocale('zh', zhCnLocale);
    defineLocale('zhcn', zhCnLocale);
    this.localeService.use('custom locale');
  }

  setDatepickerConf(lang?: string) {
    this.localeService.use(this.translate.currentLang);

    const conf = new BsDatepickerConfig();

    if (
      this.translate.instant('DATEPICKER.' + this.inputFormat) !==
      'DATEPICKER.' + this.inputFormat
    ) {
      this.placeholder = this.translate.instant(
        'DATEPICKER.' + this.inputFormat
      );
    }
    conf.dateInputFormat = lang
      ? lang === 'fr'
        ? 'YYYY-MM-DD'
        : 'YYYY/MM/DD'
      : this.inputFormat;
    conf.containerClass = 'theme-red';
    conf.showWeekNumbers = false;
    conf.customTodayClass = 'date-today';
    this.bsConfig = conf;
  }

  setDateValue(v) {
    this.formGroup.controls[this.name].setErrors(null);
    if (!v) {
      this.dateValue = null;
      this.formGroup.controls[this.name].setErrors({ required: true });
    } else if (v === 'Invalid Date') {
      this.dateValue = null;
      this.formGroup.controls[this.name].setErrors({ invalid: true });
    } else {
      const regEx =
        this.inputFormat === 'YYYY/MM/DD'
          ? /^(\d{4})(\/)(\d{1,2})(\/)(\d{1,2})$/
          : /^\d{4}-\d{2}-\d{2}$/;
      if (
        isNaN(new Date(v).getTime()) ||
        (v && v !== null && v.length && !v.match(regEx))
      ) {
        this.formGroup.controls[this.name].setErrors({ invalid: true });
      } else if (v !== null) {
        const dateSplit =
          this.inputFormat === 'YYYY/MM/DD' ? v.split('/') : v.split('-');
        const dateVal = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]); // month index is 0 based

        if (this.minDate && this.dateDiffInDays(this.minDate, dateVal) < 0) {
          this.formGroup.controls[this.name].setErrors({ min: true });
        }
        if (this.maxDate && this.dateDiffInDays(this.maxDate, dateVal) > 0) {
          this.formGroup.controls[this.name].setErrors({ max: true });
        }
        this.dateValue = dateVal;
      }
    }
  }

  setInputTouched(event) {
    this.formGroup.controls[this.name].markAsTouched();
    this.touched = true;
    // Set value after manual input to trigger validation
    this.formGroup.controls[this.name].setValue(event.target.value);
  }

  validateDate(value: Date) {
    if (!value || isNaN(value.getTime())) {
      this.setCustomLocale();
    }

    this.bsValueChangeCounter = this.bsValueChangeCounter + 1;
    if (this.bsValueChangeCounter === 1) return; // Hack found to fix bsValueChange triggerinf on init

    const strValue =
      value && !isNaN(value.getTime())
        ? this.inputFormat === 'YYYY/MM/DD'
          ? new Date(value.getTime() - value.getTimezoneOffset() * 60000)
              .toISOString()
              .split('T')[0]
              .replace(/\-/g, '/')
          : new Date(value.getTime() - value.getTimezoneOffset() * 60000)
              .toISOString()
              .split('T')[0]
        : '' + value;

    this.formGroup.controls[this.name].setValue(strValue);
    this.formGroup.controls[this.name].updateValueAndValidity();
  }
}
