import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../services/assessment/assessment.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Claim } from '../../models/assessment.interface';
import { CommonService } from '../../services/common/common.service';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { DEFAULT_EXPENSE_DETAILS } from '../../defaults/assessment.default';
import { EligibilityStatus } from '../../constants/eligibility';
import { ExpenseDetails, ExpenseForm } from '../../models/expense.interface';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { Subject, map, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnChanges, OnDestroy {
  private abortController: AbortController | null = null;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  addedClaims: Claim[];
  allFieldsAreTouched = false;
  airportOptions: string[] = [];
  amountRegex: RegExp =
    /^(?!0*$)\d{1,3}(,\d{3})*(\.\d{1,2})?$|^\d+(\.\d{1,2})?$/;
  claim: Claim;
  currencyOptions: string[] = [];
  dateFormat: string = 'YYYY-MM-DD';
  duplicateExpenseEligibility = EligibilityStatus.DuplicateExpense;
  editingIndex = -1;
  expenseDetails: ExpenseDetails = { ...DEFAULT_EXPENSE_DETAILS };
  expenseDetailsList: ExpenseDetails[] = [];
  expenseTypeDynamicsIds = {};
  expenseTypeOptions: string[] = [];
  form: FormGroup;
  formData: ExpenseForm;
  index: number = 0;
  isManualFlow: boolean;
  maxDate: Date = new Date();
  mealTypeOptions: string[] = [];
  minDate: Date = new Date();
  modalRef: BsModalRef;
  receiptScanLoading: boolean = false;
  ticketNumber: string;
  transportationTypeOptions: string[] = [];

  constructor(
    private assessmentService: AssessmentService,
    private commonService: CommonService,
    private expenseService: ExpensesService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group(
      {
        amount: [
          '',
          [Validators.required, Validators.pattern(this.amountRegex)]
        ],
        checkInDate: [''],
        checkOutDate: [''],
        currency: ['', Validators.required],
        disruptionCity: [''],
        expenseType: ['', [Validators.required]],
        mealType: [''],
        receipt: [null, [Validators.required]],
        transactionDate: [''],
        transportationType: ['']
      },
      { validators: [this.validateCheckOutDate, this.validateAmount] }
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        this.commonService.getAirports(lang).subscribe((data) => {
          this.airportOptions = data.map(
            (o) =>
              `${o.airportCode} ${o.cityName} ${o.countryName} (${o.airportName})`
          );
        });
        this.form.controls.disruptionCity.reset('');
        this.dateFormat = lang === 'fr' ? 'YYYY-MM-DD' : 'YYYY/MM/DD';
        this.assessmentService.loading = true;
        this.expenseService
          .getExpenseFormData$(lang)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              this.assessmentService.loading = false;
              this.formData = { ...data };
              this.assessmentService.error = false;
              this.expenseTypeOptions = data?.expenseTypes?.map(
                (type) => type?.description
              );
              this.expenseTypeDynamicsIds = data?.expenseTypes?.reduce(
                (obj, type) => ({
                  ...obj,
                  [type.description.toLowerCase()]: type.dynamicsId
                }),
                {}
              );
              this.mealTypeOptions = data?.mealTypes?.map(
                (type) => type?.description
              );
              this.currencyOptions = data?.currencies?.map(
                (type) => type?.description
              );
              this.transportationTypeOptions = data?.transportationTypes?.map(
                (type) => type?.description
              );
            },
            error: (error) => {
              this.assessmentService.loading = false;
              this.assessmentService.error = true;
            }
          });
      });

    this.assessmentService.addedClaims$
      .pipe(takeUntil(this.destroy$))
      .subscribe((claims) => {
        this.addedClaims = [...claims];
        this.claim = this.addedClaims[this.index];
        this.expenseDetailsList = [...(this.claim?.expenses || [])];
      });

    this.assessmentService.claimIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe((index) => {
        this.index = index;
        this.claim = this.addedClaims[index];
        this.expenseDetailsList = [...(this.claim?.expenses || [])];
      });

    this.assessmentService.manualFlow$
      .pipe(take(1))
      .subscribe((value) => (this.isManualFlow = value));

    this.assessmentService.ticketNumber$
      .pipe(take(1))
      .subscribe((ticket) => (this.ticketNumber = ticket));

    this.form.controls.expenseType.valueChanges.subscribe((value) => {
      this.updateExpenseTypeSpecificValidators(value?.toLowerCase ?? '');
    });

    this.checkAPPRDateValidation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.index) {
      this.expenseDetailsList = [];
      this.expenseDetails = { ...DEFAULT_EXPENSE_DETAILS };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  autocompleteStringValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.airportOptions.indexOf(control.value) !== -1) {
        return null;
      }
      return { invalidAutocompleteString: { value: control.value } };
    };
  }

  checkAPPRDateValidation(): void {
    if (!this.claim?.hasEURegulation && this.claim?.flights) {
      const today = new Date();
      const departureDate = new Date(
        this.claim.flights[0].scheduledDepartureDate
      );

      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      const twoYearsAgo = new Date(today);
      twoYearsAgo.setFullYear(today.getFullYear() - 2);

      // Check if the departureDate is more than 1 year old but less than 2 years old
      const isWithinRange =
        departureDate < oneYearAgo && departureDate > twoYearsAgo;
      this.minDate = isWithinRange ? twoYearsAgo : oneYearAgo;
    } else {
      this.minDate = undefined;
    }
  }

  fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((<string>reader.result).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }

  fileToBinary(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  generateRandomFiveDigitNumber() {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }

  getDays(startDate: Date, endDate: Date): number {
    const time = new Date(endDate).getTime() - new Date(startDate).getTime();
    if (time === 0) return 1;
    return time / (1000 * 3600 * 24);
  }

  onBlurAmount(event: FocusEvent): void {
    const currency = this.form.controls.currency.value;
    if (currency === 'Canadian Dollar' || currency === 'US Dollar') {
      const element = event.target as HTMLInputElement;
      let value = element.value;
      if (!value.match(this.amountRegex)) return;

      value = value.replace(/,/g, '');
      if (Number(value) > 9999999) return;

      const formattedValue = parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      });
      this.form.controls.amount.setValue(formattedValue.slice(1));
      this.form.controls.amount.updateValueAndValidity();
    }
  }

  onChangeCurrency(event): void {
    const currencyObject = this.formData?.currencies.find(
      (type) => type?.description === event?.value
    );
    this.expenseDetails = {
      ...this.expenseDetails,
      currencyDynamicsId: currencyObject?.dynamicsId,
      currency: event?.value,
      currencyCode: currencyObject?.code
    };
  }

  onChangeExpenseType(event): void {
    this.resetForm();
    const expenseTypeObject = this.formData?.expenseTypes.find(
      (type) => type?.description === event?.value
    );
    this.expenseDetails = {
      ...this.expenseDetails,
      expenseTypeDynamicsId: expenseTypeObject?.dynamicsId,
      expenseTypeId: expenseTypeObject?.id,
      expenseType: event?.value
    };

    if (
      this.expenseDetails.expenseTypeId === 1 ||
      this.expenseDetails.expenseTypeId === 4
    ) {
      this.form.controls['checkInDate'].setValidators([Validators.required]);
      this.form.controls['checkOutDate'].setValidators([Validators.required]);
      this.form.controls['disruptionCity'].setValidators([
        Validators.required,
        this.autocompleteStringValidator()
      ]);
      this.form.controls['mealType'].setValidators(null);
      this.form.controls['transactionDate'].setValidators(null);
      this.form.controls['transportationType'].setValidators(null);
    } else if (
      this.expenseDetails.expenseTypeId === 2 ||
      this.expenseDetails.expenseTypeId === 5
    ) {
      this.form.controls['checkInDate'].setValidators(null);
      this.form.controls['checkOutDate'].setValidators(null);
      this.form.controls['disruptionCity'].setValidators(null);
      this.form.controls['mealType'].setValidators([Validators.required]);
      this.form.controls['transactionDate'].setValidators([
        Validators.required
      ]);
      this.form.controls['transportationType'].setValidators(null);
    } else if (
      this.expenseDetails.expenseTypeId === 3 ||
      this.expenseDetails.expenseTypeId === 6
    ) {
      this.form.controls['checkInDate'].setValidators(null);
      this.form.controls['checkOutDate'].setValidators(null);
      this.form.controls['disruptionCity'].setValidators(null);
      this.form.controls['mealType'].setValidators(null);
      this.form.controls['transactionDate'].setValidators([
        Validators.required
      ]);
      this.form.controls['transportationType'].setValidators([
        Validators.required
      ]);
    }
  }

  onChangeMealType(event): void {
    const mealTypeObject = this.formData?.mealTypes.find(
      (type) => type?.description === event?.value
    );
    this.expenseDetails = {
      ...this.expenseDetails,
      mealTypeDynamicsId: mealTypeObject?.dynamicsId,
      mealType: event?.value
    };
  }

  async onChangeReceipt(files: FileList) {
    const validFileFormats: string[] = [
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];
    if (
      files?.length === 1 &&
      files[0].size < 5000000 &&
      validFileFormats.includes(files[0].type) &&
      !files[0].name.toLowerCase().endsWith('.jfif')
    ) {
      this.receiptScanLoading = true;
      const documentBody = await this.fileToBase64(files[0]);
      const documentBinaryBody = await this.fileToBinary(files[0]);
      const fileName = files[0].name.replace(/[^\u0000-\u007F]+/g, '');

      this.form.controls.receipt.setErrors(null);

      this.abortController = new AbortController();
      const signal = this.abortController.signal;
      const hasMalware = await this.expenseService.performMalwareDetection(
        this.generateRandomFiveDigitNumber() + fileName,
        documentBinaryBody as ArrayBuffer,
        this.ticketNumber,
        true,
        signal
      );

      if (hasMalware === false) {
        this.form.patchValue({ receipt: files });
        this.form.controls.receipt.markAsTouched();
        this.form.controls.receipt.markAsDirty();

        this.expenseDetails = {
          ...this.expenseDetails,
          receipt: files[0],
          receiptFileList: files,
          receiptFileRequest: [
            {
              documentBody: documentBody,
              fileName: fileName,
              mimeType: files[0].type
            }
          ]
        };
      } else {
        this.form.controls.receipt.markAsTouched();
        this.form.controls.receipt.markAsDirty();
        this.form.controls.receipt.setErrors({ notuploaded: true });
      }
      this.receiptScanLoading = false;
    } else {
      this.form.controls.receipt.markAsTouched();
      this.form.controls.receipt.markAsDirty();
      if (files?.length > 1) {
        this.form.controls.receipt.setErrors({ maxlength: true });
      } else if (
        !validFileFormats.includes(files[0].type) ||
        files[0].name.substr(files[0].name.lastIndexOf('.') + 1) == 'jfif'
      ) {
        this.form.controls.receipt.setErrors({ invalid: true });
      } else if (files[0].size >= 5000000) {
        this.form.controls.receipt.setErrors({ maxsize: true });
      } else {
        this.form.controls.receipt.setErrors({ required: true });
      }
      this.receiptScanLoading = false;
    }
  }

  onChangeTransportationType(event): void {
    const transportationTypeObject = this.formData?.transportationTypes.find(
      (type) => type?.description === event?.value
    );
    this.expenseDetails = {
      ...this.expenseDetails,
      transportationTypeDynamicsId: transportationTypeObject?.dynamicsId,
      transportationType: event?.value
    };
  }

  onClickAddExpense(): void {
    if (this.form.valid) {
      this.expenseDetails = {
        ...this.expenseDetails,
        transactionDate: this.form.value.transactionDate,
        amount: this.form.value.amount.replaceAll(',', ''),
        disruptionCity: this.form.value.disruptionCity
      };
      if (
        this.expenseDetails.expenseTypeId === 1 ||
        this.expenseDetails.expenseTypeId === 4
      ) {
        this.expenseDetails = {
          ...this.expenseDetails,
          checkInDate: this.form.value.checkInDate,
          checkOutDate: this.form.value.checkOutDate,
          accommodationDays: this.getDays(
            this.form.value.checkInDate,
            this.form.value.checkOutDate
          )
        };
      }
      this.expenseDetailsList.push(this.expenseDetails);
      this.assessmentService.addClaims = this.addedClaims.map((c, i) => {
        if (i === this.index) {
          return {
            ...c,
            expenses: [...this.expenseDetailsList]
          };
        }
        return c;
      });
      this.allFieldsAreTouched = true;
      this.hideForm();
      return;
    }
    if (!this.allFieldsAreTouched) {
      if (!this.form.controls.expenseType.value) {
        this.form.controls.expenseType.markAsTouched();
        this.form.controls.expenseType.markAsDirty();
      } else {
        Object.keys(this.form.controls).forEach((c) => {
          this.form.controls[c].markAsTouched();
          this.form.controls[c].markAsDirty();
        });
        this.allFieldsAreTouched = true;
      }
    }
  }

  onClickDeleteExpense(): void {
    if (this.editingIndex === -1) return;
    this.expenseDetailsList.splice(this.editingIndex, 1);
    this.assessmentService.addClaims = this.addedClaims.map((c, i) => {
      if (i === this.index) {
        return {
          ...c,
          expenses: [...this.expenseDetailsList]
        };
      }
      return c;
    });
    this.hideForm();
  }

  onClickDiscard(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.receiptScanLoading = false;
    }
    this.hideForm();
  }

  onClickUpdateExpense(): void {
    if (this.editingIndex === -1) {
      return;
    }
    if (this.form.valid) {
      this.expenseDetails = {
        ...this.expenseDetails,
        transactionDate: this.form.value.transactionDate,
        amount: this.form.value.amount.replaceAll(',', '')
      };
      if (
        this.expenseDetails.expenseTypeId === 1 ||
        this.expenseDetails.expenseTypeId === 4
      ) {
        this.expenseDetails = {
          ...this.expenseDetails,
          checkInDate: this.form.value.checkInDate,
          checkOutDate: this.form.value.checkOutDate,
          accommodationDays: this.getDays(
            this.form.value.checkInDate,
            this.form.value.checkOutDate
          )
        };
      }
      this.expenseDetailsList[this.editingIndex] = this.expenseDetails;
      this.assessmentService.addClaims = this.addedClaims.map((c, i) => {
        if (i === this.index) {
          return {
            ...c,
            expenses: [...this.expenseDetailsList]
          };
        }
        return c;
      });
      this.allFieldsAreTouched = true;
      this.hideForm();
      return;
    }

    if (!this.allFieldsAreTouched) {
      Object.keys(this.form.controls).forEach((c) => {
        if (c !== 'bookingReference') {
          this.form.controls[c].markAsTouched();
          this.form.controls[c].markAsDirty();
        }
      });
      this.allFieldsAreTouched = true;
    }
  }

  onFocusAmount(event: FocusEvent): void {
    const currency = this.form.controls.currency.value;
    if (currency == 'Canadian Dollar' || currency === 'US Dollar') {
      const element = event.target as HTMLInputElement;
      let value = element.value;
      if (!value.match(this.amountRegex)) return;

      value = value.replace(/,/g, '');
      if (value.endsWith('.00')) {
        value = value.slice(0, -3);
      }
      this.form.controls.amount.setValue(value);
      this.form.controls.amount.updateValueAndValidity();
    }
  }

  hideForm(): void {
    this.expenseDetails = { ...DEFAULT_EXPENSE_DETAILS };
    this.modalRef.hide();
    this.form.reset();
    this.form.updateValueAndValidity();
    setTimeout(() => {
      this.updateExpenseTypeSpecificValidators('');
    });
  }

  resetForm(): void {
    this.form.controls['amount'].markAsPristine();
    this.form.controls['amount'].markAsUntouched();
    this.form.controls['amount'].setErrors(null);
    this.form.controls['amount'].setValue('');

    this.form.controls['checkInDate'].markAsPristine();
    this.form.controls['checkInDate'].markAsUntouched();
    this.form.controls['checkInDate'].setErrors(null);
    this.form.controls['checkInDate'].setValue('');

    this.form.controls['checkOutDate'].markAsPristine();
    this.form.controls['checkOutDate'].markAsUntouched();
    this.form.controls['checkOutDate'].setErrors(null);
    this.form.controls['checkOutDate'].setValue('');

    this.form.controls['currency'].markAsPristine();
    this.form.controls['currency'].markAsUntouched();
    this.form.controls['currency'].setErrors(null);
    this.form.controls['currency'].setValue('');

    this.form.controls['disruptionCity'].markAsPristine();
    this.form.controls['disruptionCity'].markAsUntouched();
    this.form.controls['disruptionCity'].setErrors(null);
    this.form.controls['disruptionCity'].setValue('');

    this.form.controls['mealType'].markAsPristine();
    this.form.controls['mealType'].markAsUntouched();
    this.form.controls['mealType'].setErrors(null);
    this.form.controls['mealType'].setValue('');

    this.form.controls['receipt'].markAsPristine();
    this.form.controls['receipt'].markAsUntouched();
    this.form.controls['receipt'].setErrors(null);
    this.form.controls['receipt'].setValue('');

    this.form.controls['transactionDate'].markAsPristine();
    this.form.controls['transactionDate'].markAsUntouched();
    this.form.controls['transactionDate'].setErrors(null);
    this.form.controls['transactionDate'].setValue('');

    this.form.controls['transportationType'].markAsPristine();
    this.form.controls['transportationType'].markAsUntouched();
    this.form.controls['transportationType'].setErrors(null);
    this.form.controls['transportationType'].setValue('');

    this.form.updateValueAndValidity();
    this.allFieldsAreTouched = false;
  }

  setFormValues(expenseDetails: ExpenseDetails): void {
    this.form.controls.expenseType.setValue(expenseDetails.expenseType);
    this.form.controls.disruptionCity.setValue(expenseDetails.disruptionCity);
    this.form.controls.currency.setValue(expenseDetails.currency);
    this.form.controls.amount.setValue(expenseDetails.amount);
    this.form.controls.receipt.setValue(expenseDetails.receiptFileList);

    if (
      expenseDetails.expenseTypeId === 1 ||
      this.expenseDetails.expenseTypeId === 4
    ) {
      this.form.controls.checkInDate.setValue(expenseDetails.checkInDate);
      this.form.controls.checkOutDate.setValue(expenseDetails.checkOutDate);
    }

    if (
      expenseDetails.expenseTypeId === 2 ||
      this.expenseDetails.expenseTypeId === 5
    ) {
      this.form.controls.mealType.setValue(expenseDetails.mealType);
      this.form.controls.transactionDate.setValue(
        expenseDetails.transactionDate
      );
    }

    if (
      expenseDetails.expenseTypeId === 3 ||
      this.expenseDetails.expenseTypeId === 6
    ) {
      this.form.controls.transportationType.setValue(
        expenseDetails.transportationType
      );
      this.form.controls.transactionDate.setValue(
        expenseDetails.transactionDate
      );
    }

    this.form.updateValueAndValidity();
  }

  showAddForm(template: TemplateRef<any>): void {
    this.editingIndex = -1;
    this.form.reset();
    this.showForm(template, true);
  }

  showEditForm(index, template: TemplateRef<any>): void {
    this.editingIndex = index;
    this.expenseDetails = { ...this.expenseDetailsList[index] };
    this.setFormValues(this.expenseDetails);
    this.showForm(template, false);
  }

  showForm(
    template: TemplateRef<any>,
    closeModalOnOutsideClick: boolean
  ): void {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: closeModalOnOutsideClick
    });
  }

  updateExpenseTypeSpecificValidators(expenseType: string) {
    const accommodationExpenseTypes = [
      'overnight accommodation',
      'hébergement'
    ];
    const mealExpenseTypes = ['meal', 'repas'];
    const transportationExpenseTypes = ['transportation', 'transport'];

    if (accommodationExpenseTypes.includes(expenseType)) {
      this.form.controls.checkInDate.setValidators([Validators.required]);
      this.form.controls.checkOutDate.setValidators([Validators.required]);
      this.form.controls.mealType.setValidators(null);
      this.form.controls.transactionDate.setValidators(null);
      this.form.controls.transportationType.setValidators(null);
    } else if (mealExpenseTypes.includes(expenseType)) {
      this.form.controls.mealType.setValidators([Validators.required]);
      this.form.controls.transactionDate.setValidators([Validators.required]);
      this.form.controls.transportationType.setValidators(null);
    } else if (transportationExpenseTypes.includes(expenseType)) {
      this.form.controls.transportationType.setValidators([
        Validators.required
      ]);
      this.form.controls.transactionDate.setValidators([Validators.required]);
      this.form.controls.mealType.setValidators(null);
    } else {
      this.form.controls.checkInDate.setValidators(null);
      this.form.controls.checkOutDate.setValidators(null);
      this.form.controls.mealType.setValidators(null);
      this.form.controls.transactionDate.setValidators(null);
      this.form.controls.transportationType.setValidators(null);
    }
    this.form.updateValueAndValidity();
  }

  validateAmount(form: FormGroup): ValidationErrors | null {
    const validCurrencyFormats: string[] = [
      'Canadian Dollar',
      'US Dollar',
      'Dollar Canadien',
      'Dollars Américain'
    ];
    const currency = form.value.currency;
    const value = form.value.amount;
    if (!isNaN(Number(value))) {
      if (Number(value) === 0) {
        form.controls.amount.setErrors({
          ...form.controls.amount.errors,
          notZero: true
        });
      } else if (!validCurrencyFormats.includes(currency)) {
        let errors = { ...form.controls.amount.errors };
        delete errors.maxAmount;
        const updatedErrors = Object.keys(errors).length ? { ...errors } : null;
        form.controls.amount.setErrors(updatedErrors);
      } else if (Number(value.replace(/,/g, '')) > 9999999) {
        form.controls.amount.setErrors({
          ...form.controls.amount.errors,
          maxAmount: true
        });
      }
    } else {
      let errors = { ...form.controls.amount.errors };
      delete errors.notZero;
      delete errors.maxAmount;
      const updatedErrors = Object.keys(errors).length ? { ...errors } : null;
      form.controls.amount.setErrors(updatedErrors);
    }
    return null;
  }

  validateCheckOutDate(form: FormGroup): ValidationErrors | null {
    if (form.value.checkInDate && form.value.checkOutDate) {
      form.controls.checkInDate.markAsTouched();
      form.controls.checkOutDate.markAsTouched();
      const checkInDate = new Date(form.value.checkInDate).getTime();
      const checkOutDate = new Date(form.value.checkOutDate).getTime();
      if (checkOutDate < checkInDate) {
        form.controls.checkOutDate.setErrors({ invalidCheckOutDate: true });
      }
      return null;
    }
  }
}
