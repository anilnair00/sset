import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidateOtherControlValueValidator(
  controlName: string,
  otherControlName: string
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    const control = formGroup.controls[controlName];
    const otherControl = formGroup.controls[otherControlName];

    if (otherControl.value && !control.value) {
      control.setErrors({ validateOtherControlValueValidator: true });
    } else {
      control.setErrors(null);
    }
    return;
  };
}
