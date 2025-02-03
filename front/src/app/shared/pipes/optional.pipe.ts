import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optional'
})
export class OptionalPipe implements PipeTransform {
  constructor() {}

  transform(value: string): any {
    return value + '(optional)';
  }
}
