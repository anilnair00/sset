import { ISearchForm } from './../../models/search-form.interface';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { SsetStoreService } from '../../sset-store.service';
import { takeUntil, debounceTime, filter, pairwise } from 'rxjs/operators';
import { inputLengthValidator } from 'src/app/shared/validators/input-length.directive';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit, OnDestroy {
  private pnrPattern = '[a-zA-Z0-9]*';
  private ticketNumberPattern = '[0-9]*';
  private currentPattern = this.pnrPattern;

  reset = false;

  form: UntypedFormGroup = new UntypedFormGroup({
    pnrTicket: new UntypedFormControl('', [
      inputLengthValidator([6, 13]),
      Validators.required,
      Validators.pattern(this.pnrPattern)
    ]),
    lastName: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^([ \u00c0-\u01ffa-zA-Z'-])+$"),
      Validators.maxLength(50)
    ]),
    firstName: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern("^([ \u00c0-\u01ffa-zA-Z'-])+$"),
      Validators.maxLength(50)
    ]),
    date: new UntypedFormControl('', [Validators.required])
  });

  // Input date
  dateFormat: string = 'YYYY-MM-DD';
  private apprStartDate = new Date(2019, 11, 15); //  dec 15th 2019, months start at 0;
  minDate: Date;
  maxDate: Date;

  disableBtn = false;
  modalRef: BsModalRef;

  allFieldsAreTouched = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public store: SsetStoreService,
    private modalService: BsModalService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    const d365 = new Date();
    d365.setDate(d365.getDate() - 366);
    this.minDate = d365 < this.apprStartDate ? d365 : this.apprStartDate;

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

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

    this.form.controls.pnrTicket.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v) => {
        const pattern =
          v && v.length > 6 ? this.ticketNumberPattern : this.pnrPattern;
        if (pattern !== this.currentPattern) {
          this.form.controls.pnrTicket.setValidators([
            inputLengthValidator([6, 13]),
            Validators.required,
            Validators.pattern(pattern)
          ]);
          this.currentPattern = pattern;
          this.form.controls.pnrTicket.updateValueAndValidity({
            emitEvent: false
          });
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
      .subscribe(() => (this.disableBtn = false));

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
              case 'PNR':
              case 'TicketNumber':
                this.form.controls.pnrTicket.setErrors(validationErrs);
                break;
              case 'FlightDate':
                this.form.controls.date.setErrors(validationErrs);
                break;
              case 'FirstName':
                this.form.controls.firstName.setErrors(validationErrs);
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
        } else {
          this.form.updateValueAndValidity();
        }
      });
  }

  onSearch(e) {
    e.preventDefault();
    if (this.form.valid) {
      const formData: ISearchForm = {
        pnrTicket: this.form.value.pnrTicket,
        lastName: this.form.value.lastName,
        firstName: this.form.value.firstName,
        date: this.form.value.date
      };
      this.store.search(formData);
      this.allFieldsAreTouched = true;
    } else if (!this.allFieldsAreTouched) {
      // Ensure fields are dirty & touched to show validation errors when searching with invalid fields
      Object.keys(this.form.controls).forEach((c) => {
        this.form.controls[c].markAsTouched();
        this.form.controls[c].markAsDirty();
      });
      this.allFieldsAreTouched = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }
}
