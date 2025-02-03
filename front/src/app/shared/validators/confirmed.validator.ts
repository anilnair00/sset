import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ConfirmedValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value.toLowerCase() !== matchingControl.value.toLowerCase()) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
    return;
  };
}
