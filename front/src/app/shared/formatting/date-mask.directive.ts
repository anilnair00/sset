import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateMask]'
})
export class DateMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input') onEvent() {
    this.formatInput();
  }

  private formatInput() {
    let dateValue = this.el.nativeElement.value;

    if (dateValue.includes('valid')) {
      this.el.nativeElement.value = '';
    } else {
      if (dateValue.length > 5) {
        dateValue = dateValue.substr(0, 5);
      }

      dateValue = dateValue.replace(/-/g, '');
      const digits = [];
      digits.push(dateValue.substr(0, 2));

      if (dateValue.substr(2, 2) !== '') {
        digits.push(dateValue.substr(2, 2));
      }

      this.el.nativeElement.value = digits.join('-');
    }
  }
}
