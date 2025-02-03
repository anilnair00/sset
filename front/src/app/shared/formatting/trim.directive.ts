import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {
  private readonly _trimStartRegex = /^\s+/;
  private readonly _trimEndRegex = /\s+$/;

  constructor(private el: ElementRef) {}

  @HostListener('change') onEvent() {
    this.formatInput();
  }

  private formatInput() {
    let trimmedValue = this.el.nativeElement.value;

    if (typeof trimmedValue === 'string') {
      trimmedValue = trimmedValue.replace(this._trimStartRegex, '');
      trimmedValue = trimmedValue.replace(this._trimEndRegex, '');
    }

    if (trimmedValue !== this.el.nativeElement.value) {
      this.el.nativeElement.value = trimmedValue;
      this.el.nativeElement.dispatchEvent(new Event('input'));
    }
  }
}
