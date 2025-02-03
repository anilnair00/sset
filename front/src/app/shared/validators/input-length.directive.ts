import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn
} from '@angular/forms';

export function inputLengthValidator(
  validLengthsArr,
  allowEmptyValue?
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return validLengthsArr.includes(control.value && control.value.length) ||
      (allowEmptyValue && !control.value.length)
      ? null
      : { invalidInputLength: true };
  };
}

@Directive({
  selector: '[appInputLength]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: InputLengthDirective, multi: true }
  ]
})
export class InputLengthDirective implements Validator {
  @Input('appInputLength') appInputLength: number[];

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    // no error is returned when input is empty to avoid overlap with required validation
    if (
      !control.value ||
      control.value.length === 0 ||
      this.appInputLength.length === 0
    ) {
      return null;
    }

    return inputLengthValidator(this.appInputLength)(control);
  }
}
