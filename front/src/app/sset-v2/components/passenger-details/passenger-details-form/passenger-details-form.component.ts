import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from '../../../services/assessment/assessment.service';
import { CommonService } from 'src/app/sset-v2/services/common/common.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfirmedValidator } from '../../../../shared/validators/confirmed.validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Passenger } from '../../../models/passenger.interface';
import { PostalCodeValidator } from '../../../../shared/validators/postalcode.validator';
import { Subject, map, takeUntil } from 'rxjs';
import { ValidateOtherControlValueValidator } from '../../../../shared/validators/validateothercontrolvalue.validator';

@Component({
  selector: 'app-passenger-details-form',
  templateUrl: './passenger-details-form.component.html',
  styleUrls: ['./passenger-details-form.component.scss']
})
export class PassengerDetailsFormComponent implements OnInit, OnDestroy {
  @Input() aeroplanStatusOptions: string[] = [];
  @Input() countryOptions: string[] = [];
  @Input() formData;
  @Input() isManualFlow: boolean;
  @Input() passengerDetails: Passenger;
  @Input() provinceOptions: string[] = [];
  @Input() titleOptions: string[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();
  activeLanguage: string;
  allFieldsAreTouched = false;
  CAN_USA_COUNTIRES = ['Canada', 'United States of America', 'États-Unis'];
  form: FormGroup;
  isDisabled: boolean = true;
  phoneNumberExtPattern = '^[0-9]*$'; // numbers only
  phoneNumberPattern = '^([0-9()-])+$'; // allows numbers () -
  provinceList = [];
  unamePattern = "^([a-zA-Z0-9'-.])+$";

  constructor(
    private assessmentService: AssessmentService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group(
      {
        aeroplanStatus: [{ value: '', disabled: this.isDisabled }],
        altPhoneNumber: '',
        altPhoneNumberExt: ['', Validators.pattern(this.phoneNumberExtPattern)],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        confirmEmailAddress: ['', [Validators.required, Validators.email]],
        country: ['', Validators.required],
        emailAddress: ['', [Validators.required, Validators.email]],
        firstName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(this.unamePattern)
          ]
        ],
        freqFlyerNumber: '',
        isPrimaryApplicant: true,
        isSameAddressContact: false,
        lastName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(this.unamePattern)
          ]
        ],
        permanentMailingAddress: [
          '',
          [Validators.required, Validators.maxLength(100)]
        ],
        postalCode: '',
        primaryPhoneNumber: ['', Validators.required],
        primaryPhoneNumberExt: [
          '',
          Validators.pattern(this.phoneNumberExtPattern)
        ],
        province: ['', [Validators.required, Validators.maxLength(50)]],
        ticket: ['', Validators.pattern('[0-9]{13}')],
        title: ['', Validators.required]
      },
      {
        validators: [
          ValidateOtherControlValueValidator(
            'aeroplanStatus',
            'freqFlyerNumber'
          ),
          ConfirmedValidator('emailAddress', 'confirmEmailAddress'),
          PostalCodeValidator('country', 'postalCode')
        ]
      }
    );
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((p) => p.get('lang')),
        takeUntil(this.destroy$)
      )
      .subscribe((lang: string) => {
        this.activeLanguage = lang;
      });

    this.form.controls['isPrimaryApplicant'].setValue(
      this.passengerDetails?.isPrimaryApplicant
    );

    this.form.controls['firstName'].setValue(this.passengerDetails?.firstName);
    if (this.passengerDetails?.firstName) {
      this.form.controls['firstName'].disable();
    }

    this.form.controls['lastName'].setValue(this.passengerDetails?.lastName);
    if (this.passengerDetails?.lastName) {
      this.form.controls['lastName'].disable();
    }

    if (this.passengerDetails?.title) {
      this.form.controls['title'].setValue(this.passengerDetails.title);
      this.form.controls['isSameAddressContact'].setValue(
        this.passengerDetails.isSameAddressContact
      );
      this.form.controls['ticket'].setValue(this.passengerDetails.ticketNumber);
      this.copyAddressContracts(this.passengerDetails);
      this.updateValidatorsByChecking(
        this.passengerDetails.isSameAddressContact
      );
    }
     
    if (this.passengerDetails?.isPrimaryApplicant && !this.isManualFlow) {
      this.form.controls['aeroplanStatus'].setValue(this.passengerDetails?.aeroplanDynamicsId);
      this.form.controls['freqFlyerNumber'].setValue(this.passengerDetails?.freqFlyerNumber);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  changeAeroplanStatusState(): void {
    let flyerNumber = this.form.controls['freqFlyerNumber'].value;
    const control = this.form.get('aeroplanStatus');
    control.disable();
    if (flyerNumber !== null && flyerNumber !== '') {
      control.enable();
    } else {
      this.form.controls['aeroplanStatus'].setValue('');
    }
  }

  clearAddressContractValidators() {
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.controls.postalCode.setErrors(null);

    this.form.controls.permanentMailingAddress.clearValidators();
    this.form.controls.city.clearValidators();
    this.form.controls.country.clearValidators();
    this.form.controls.province.clearValidators();
    this.form.controls.emailAddress.clearValidators();
    this.form.controls.confirmEmailAddress.clearValidators();
    this.form.controls.primaryPhoneNumber.clearValidators();
    this.form.controls.primaryPhoneNumberExt.clearValidators();
    this.form.controls.altPhoneNumberExt.clearValidators();
  }

  copyAddressContracts(passengerDetails: Passenger) {
    this.form.controls['aeroplanStatus'].setValue(
      passengerDetails.aeroplanStatus
    );
    this.form.controls['city'].setValue(passengerDetails.city);
    this.form.controls['confirmEmailAddress'].setValue(
      passengerDetails.confirmEmailAddress
    );
    this.form.controls['country'].setValue(passengerDetails.country);
    this.form.controls['emailAddress'].setValue(passengerDetails.emailAddress);
    this.form.controls['freqFlyerNumber'].setValue(
      passengerDetails.freqFlyerNumber
    );
    this.form.controls['permanentMailingAddress'].setValue(
      passengerDetails.addressStreet
    );
    this.form.controls['postalCode'].setValue(passengerDetails.zipCode);
    this.form.controls['province'].setValue(passengerDetails.province);

    if (
      passengerDetails.mobilePhone &&
      passengerDetails.mobilePhone.includes('x')
    ) {
      this.form.controls['altPhoneNumber'].setValue(
        passengerDetails.mobilePhone.split('x')[0]
      );
      this.form.controls['altPhoneNumberExt'].setValue(
        passengerDetails.mobilePhone.split('x')[1]
      );
    } else {
      this.form.controls['altPhoneNumber'].setValue(
        passengerDetails.mobilePhone
      );
    }

    if (
      passengerDetails.primaryPhoneNumber &&
      passengerDetails.primaryPhoneNumber.includes('x')
    ) {
      this.form.controls['primaryPhoneNumber'].setValue(
        passengerDetails.primaryPhoneNumber.split('x')[0]
      );
      this.form.controls['primaryPhoneNumberExt'].setValue(
        passengerDetails.primaryPhoneNumber.split('x')[1]
      );
    } else {
      this.form.controls['primaryPhoneNumber'].setValue(
        passengerDetails.primaryPhoneNumber
      );
    }

    if (this.form.controls['freqFlyerNumber'].value) {
      this.form.controls['aeroplanStatus'].enable();
    } else {
      this.form.controls['aeroplanStatus'].disable();
    }
  }

  getDetails() {
    this.passengerDetails = {
      ...this.passengerDetails,
      addressStreet: this.form.controls['permanentMailingAddress'].value,
      aeroplanStatus: this.form.controls['aeroplanStatus'].value,
      city: this.form.controls['city'].value,
      confirmEmailAddress: this.form.controls['confirmEmailAddress'].value,
      country: this.form.controls['country'].value,
      emailAddress: this.form.controls['emailAddress'].value,
      firstName: this.form.controls['firstName'].value,
      freqFlyerNumber: this.form.controls['freqFlyerNumber'].value,
      isPrimaryApplicant: this.form.controls['isPrimaryApplicant'].value,
      isSameAddressContact: this.form.controls['isSameAddressContact'].value,
      lastName: this.form.controls['lastName'].value,
      mobilePhone: this.getPhoneNumber('altPhoneNumber', 'altPhoneNumberExt'),
      primaryPhoneNumber: this.getPhoneNumber(
        'primaryPhoneNumber',
        'primaryPhoneNumberExt'
      ),
      province: this.form.controls['province'].value,
      title: this.form.controls['title'].value,
      ticketNumber: this.form.controls['ticket'].value,
      zipCode: this.form.controls['postalCode'].value
    };
    return this.passengerDetails;
  }

  getPhoneNumber(formControlName: string, formControlExtName: string): string {
    if (
      this.CAN_USA_COUNTIRES.includes(this.form.controls.country.value) &&
      this.form.controls[formControlExtName].value
    ) {
      return `${this.form.controls[formControlName].value}x${this.form.controls[formControlExtName].value}`;
    } else {
      return this.form.controls[formControlName].value;
    }
  }

  onBlurPhoneNumber(event: FocusEvent, formControlName: string) {
    /* apply validation rules only if the country is Canada, United States of America or Etats-Unis and phone number is not empty */
    if (
      this.CAN_USA_COUNTIRES.includes(this.form.controls.country.value) &&
      event.target['value']
    ) {
      /* xxx-xxx-xxxx format */
      const phoneNumberFormat = /^\d{3}-\d{3}-\d{4}$/;
      const value = event.target['value'];
      if (value.match(/\d/g)?.length !== 10) {
        this.form.controls[formControlName].setErrors({ invalidInput: true });
      } else {
        /** remove all ()- chars and set the format to xxx-xxx-xxxx */
        const formattedValue = value
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')
          .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        if (!phoneNumberFormat.test(formattedValue)) {
          this.form.controls[formControlName].setErrors({ invalidInput: true });
        } else {
          this.form.controls[formControlName].setErrors({
            ...this.form.controls[formControlName].errors,
            invalidInput: false
          });
          this.form.controls[formControlName].setValue(formattedValue);
        }
      }
    }
  }

  onChangeAeroplan(event) {
    const aeroplanObject = this.formData?.starAllianceTiers.find(
      (status) => status?.description === event?.value
    );
    this.passengerDetails.aeroplanDynamicsId = aeroplanObject?.dynamicsId;
  }

  onChangeCountry(event) {
    const countryCode: string =
      event?.value === 'Canada'
        ? 'CAN'
        : event?.value === 'United States of America' ||
          event?.value === 'États-Unis'
        ? 'USA'
        : '';
    if (countryCode) {
      this.assessmentService.loading = true;
      this.commonService
        .getProvinceDetails$(this.activeLanguage, countryCode)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.assessmentService.loading = false;
            this.provinceList = [...data];
            this.provinceOptions = data.map(
              (province) => province?.description
            );
          },
          error: (error) => {
            this.assessmentService.loading = false;
            this.assessmentService.error = true;
          }
        });
    } else {
      this.provinceOptions = [];
    }

    const countryObject = this.formData?.countries.find(
      (country) => country?.description === event?.value
    );
    this.passengerDetails.countryDynamicsId = countryObject?.dynamicsId;
    this.passengerDetails.provinceDynamicsId = '';
    this.form.controls['province'].setValue('');
    this.setPhoneNumberValidities(event.value);
  }

  onChangePostalCode() {
    const countryControl = this.form.controls['country'];
    const postalCodeControl = this.form.controls['postalCode'];

    if (!countryControl || !postalCodeControl) {
      return;
    }

    const country = countryControl.value?.toUpperCase();

    if (country === 'CANADA') {
      let postalCode = postalCodeControl.value || '';
      postalCode = postalCode.replace(/\s/g, '').toUpperCase();

      if (postalCode.length !== 6) {
        return;
      }

      const formattedPostalCode = `${postalCode.slice(0, 3)} ${postalCode.slice(
        3
      )}`;

      if (postalCodeControl.value !== formattedPostalCode) {
        postalCodeControl.setValue(formattedPostalCode);
      }
    }
  }

  onChangeProvince(event) {
    const provinceObject = this.provinceList.find(
      (province) => province?.description === event?.value
    );
    this.passengerDetails.provinceDynamicsId = provinceObject?.code;
  }

  onChangeTitle(event) {
    const titleObject = this.formData?.titles.find(
      (title) => title?.description === event?.value
    );
    this.passengerDetails.titleDynamicsId = titleObject?.dynamicsId;
  }

  onClickSameAddress() {
    this.updateValidatorsByChecking(
      !this.form.controls['isSameAddressContact'].value
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.allFieldsAreTouched = true;
      return {
        ...this.getDetails(),
        isValid: true
      };
    }
    if (!this.allFieldsAreTouched) {
      Object.keys(this.form.controls).forEach((c) => {
        this.form.controls[c].markAsTouched();
        this.form.controls[c].markAsDirty();
      });
      this.allFieldsAreTouched = true;
    }
    return {
      ...this.passengerDetails,
      isValid: false
    };
  }

  setAddressContractValidators() {
    this.form.setValidators([
      PostalCodeValidator('country', 'postalCode'),
      ConfirmedValidator('emailAddress', 'confirmEmailAddress'),
      ValidateOtherControlValueValidator('aeroplanStatus', 'freqFlyerNumber')
    ]);
    this.form.updateValueAndValidity();

    this.form.controls.permanentMailingAddress.setValidators([
      Validators.required,
      Validators.maxLength(100)
    ]);
    this.form.controls.city.setValidators([
      Validators.required,
      Validators.maxLength(50)
    ]);
    this.form.controls.country.setValidators([Validators.required]);
    this.form.controls.province.setValidators([
      Validators.required,
      Validators.maxLength(50)
    ]);
    this.form.controls.emailAddress.setValidators([
      Validators.required,
      Validators.email
    ]);
    this.form.controls.confirmEmailAddress.setValidators([
      Validators.required,
      Validators.email
    ]);
    this.form.controls.primaryPhoneNumberExt.setValidators([
      Validators.pattern(this.phoneNumberExtPattern)
    ]);
    this.form.controls.altPhoneNumberExt.setValidators([
      Validators.pattern(this.phoneNumberExtPattern)
    ]);
  }

  setPhoneNumberValidities = (country: string) => {
    if (this.CAN_USA_COUNTIRES.includes(country)) {
      this.form.controls.primaryPhoneNumber.setValidators([
        Validators.required,
        Validators.pattern(this.phoneNumberPattern)
      ]);
      this.form.controls.altPhoneNumber.setValidators([
        Validators.pattern(this.phoneNumberPattern)
      ]);
      this.form.controls.primaryPhoneNumber.updateValueAndValidity();
      this.form.controls.altPhoneNumber.updateValueAndValidity();
    } else {
      this.form.controls.primaryPhoneNumber.clearValidators();
      this.form.controls.primaryPhoneNumber.setValidators([
        Validators.required
      ]);
      this.form.controls.primaryPhoneNumber.updateValueAndValidity();
      this.form.controls.altPhoneNumber.clearValidators();
      this.form.controls.altPhoneNumber.updateValueAndValidity();
    }
  };

  updateAddressContractValueAndValidity() {
    this.form.controls.permanentMailingAddress.updateValueAndValidity();
    this.form.controls.city.updateValueAndValidity();
    this.form.controls.country.updateValueAndValidity();
    this.form.controls.province.updateValueAndValidity();
    this.form.controls.emailAddress.updateValueAndValidity();
    this.form.controls.confirmEmailAddress.updateValueAndValidity();
    this.form.controls.primaryPhoneNumber.updateValueAndValidity();
    this.form.controls.primaryPhoneNumberExt.updateValueAndValidity();
    this.form.controls.altPhoneNumberExt.updateValueAndValidity();
  }

  updateValidatorsByChecking(isSameAddressContact) {
    if (isSameAddressContact) {
      this.clearAddressContractValidators();
      this.updateAddressContractValueAndValidity();
    } else {
      this.setAddressContractValidators();
      this.updateAddressContractValueAndValidity();
      this.setPhoneNumberValidities(this.form.controls['country'].value);
    }
  }
}
