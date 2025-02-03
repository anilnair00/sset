import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTrimTextarea]'
})
export class TrimTextareaDirective {
  private readonly _trimStartRegex = /^\s+/;
  private readonly _trimMiddleRegex = /(\s){3,}$/;
  private readonly _trimEndRegex = /(\s)+$/;

  constructor(private el: ElementRef) {}

  @HostListener('input') onEvent() {
    this.formatTextarea();
  }
  private formatTextarea() {
    let trimmedValue = this.el.nativeElement.value;

    if (typeof trimmedValue === 'string') {
      trimmedValue = trimmedValue.replace(this._trimMiddleRegex, '$1$1');
    }

    if (trimmedValue !== this.el.nativeElement.value) {
      this.el.nativeElement.value = trimmedValue;
    }
  }

  @HostListener('blur') onBlur() {
    this.trimTextarea();
  }
  private trimTextarea() {
    let trimmedValue = this.el.nativeElement.value;

    if (typeof trimmedValue === 'string') {
      trimmedValue = trimmedValue.replace(this._trimEndRegex, ' ');
    }

    if (trimmedValue !== this.el.nativeElement.value) {
      this.el.nativeElement.value = trimmedValue;
    }
  }
}
