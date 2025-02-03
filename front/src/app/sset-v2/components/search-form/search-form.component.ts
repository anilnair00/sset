import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { debounceTime, filter, map, pairwise, takeUntil } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { GatewayResponse } from '../../models/api-gateway.interface';
import { inputLengthValidator } from './../../../shared/validators/input-length.directive';
import { SearchForm } from './../../models/search-form.interface';
import { SsetStoreService } from '../../sset-store.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  allFieldsAreTouched = false;
  disableBtn = false;
  form: UntypedFormGroup = new UntypedFormGroup({
    ticket: new UntypedFormControl('', [
      inputLengthValidator([13]),
      Validators.required,
      Validators.pattern('[0-9]*')
    ]),
    lastName: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^([ \u00c0-\u01ffa-zA-Z0-9'.])+$"),
      Validators.maxLength(50)
    ])
  });
  modalRef: BsModalRef;
  reset = false;

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    public store: SsetStoreService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.store.formReset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.reset();
      this.reset = true;
      this.allFieldsAreTouched = false;
      setTimeout(() => (this.reset = false));
    });

    this.store.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      if (loading) {
        this.disableBtn = true;
      }
    });

    this.form.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$), pairwise())
      .subscribe(([prev, next]) => {
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          this.store.result = undefined;
        }
      });

    this.store.result$
      .pipe(
        takeUntil(this.destroy$),
        filter((t) => t !== undefined)
      )
      .subscribe(() => {
        this.disableBtn = false;
      });

    this.store.validationExceptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((validationExceptions) => {
        if (validationExceptions && validationExceptions.length) {
          const errs: any[] = validationExceptions.reduce(
            (result, item) => ({
              ...result,
              [item.propertyName]: [
                ...(result[item[item.propertyName]] || []),
                item.businessRuleCode
              ]
            }),
            Object.create(null)
          );

          Object.keys(errs).forEach((field) => {
            const validationErrs = {};
            if (errs[field]) {
              validationErrs[errs[field]] = true;
            }
            switch (field) {
              case 'TicketNumber':
                this.form.controls.ticket.setErrors(validationErrs);
                break;
              case 'LastName':
                this.form.controls.lastName.setErrors(validationErrs);
                break;
              default:
                if (environment.environmentName === 'DIT') {
                  console.error(
                    'Error occured in a field that was not expected!'
                  );
                }
                break;
            }
          });
          this.disableBtn = false;
        } else {
          this.form.updateValueAndValidity();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  goToAssessment(): void {
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

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const formData: SearchForm = {
        ticket: this.form.value.ticket,
        lastName: this.form.value.lastName
      };
      this.store.search(formData, (eligibilityResponse: GatewayResponse) => {
        if (!eligibilityResponse?.errorCode) {
          this.goToAssessment();
        }
      });
      this.allFieldsAreTouched = true;
    } else if (!this.allFieldsAreTouched) {
      Object.keys(this.form.controls).forEach((c) => {
        this.form.controls[c].markAsTouched();
        this.form.controls[c].markAsDirty();
      });
      this.allFieldsAreTouched = true;
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }
}
