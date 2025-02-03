import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidatorFn
} from '@angular/forms';
import { Converters } from '../formatting/converters';

export interface IRange {
  min?: number;
  max?: number;
}

export function rangeValidator(range: IRange): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const controlVal = Converters.FromAmountToDecimal(control.value);
    const outOfRange =
      (!!range.min ? controlVal < range.min : false) ||
      (!!range.max ? controlVal > range.max : false);
    return outOfRange
      ? { outOfRange: { min: range.min, max: range.max } }
      : null;
  };
}

@Directive({
  selector: '[appRange]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: RangeDirective, multi: true }
  ]
})
export class RangeDirective implements Validator {
  @Input('appRange') appRange: IRange;

  constructor() {}

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.appRange ? rangeValidator(this.appRange)(control) : null;
  }
}
