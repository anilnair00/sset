import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

var us = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
var ca = new RegExp(/^([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}$/i);

export function PostalCodeValidator(
  countryKey: string,
  postalCodeKey: string
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    const countryControl = formGroup.controls[countryKey];
    const postalCodeControl = formGroup.controls[postalCodeKey];
    const country = countryControl.value ?? '';
    const postalCode = postalCodeControl.value ?? '';

    if (country.toUpperCase() === 'CANADA') {
      if (!postalCode) {
        postalCodeControl.setErrors({ required_ca: true });
      } else if (!ca.test(postalCode.toString().replace(/ /g, ''))) {
        postalCodeControl.setErrors({ pattern_ca: true });
      }
      return;
    }
    if (
      country.toUpperCase() === 'UNITED STATES OF AMERICA' ||
      country.toUpperCase() === 'ÉTATS-UNIS'
    ) {
      if (!postalCode) {
        postalCodeControl.setErrors({ required_us: true });
      } else if (!us.test(postalCode.toString())) {
        postalCodeControl.setErrors({ pattern_us: true });
      }
      return;
    }
    if (!postalCode) {
      postalCodeControl.setErrors({ required_ca: true });
      return;
    }
    if (postalCode.length > 50) {
      postalCodeControl.setErrors({ maxlength: true });
    }
  };
}
