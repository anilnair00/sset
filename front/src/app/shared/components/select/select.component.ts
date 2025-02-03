import {
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectComponent {
  @Input() disabled: boolean = false;
  @Input() formCntrlName: string;
  @Input() formGroup: FormBuilder;
  @Input() label: string;
  @Input() options: any[];
  @Output() onChange = new EventEmitter<string>();

  selectOptions = new FormControl('');

  onOpenedChange(opened: boolean) {
    if (!opened) {
      const pristine = this.formGroup['controls'][this.formCntrlName].pristine;
      const value = this.formGroup['controls'][this.formCntrlName].value;
      if (pristine && value === '') {
        this.formGroup['controls'][this.formCntrlName].markAsUntouched();
      }
    }
  }

  onSelectionChange(event: any) {
    this.onChange.emit(event);
  }
}
