import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutocompleteComponent implements OnInit {
  @Input() error: boolean;
  @Input() formCntrl: FormControl<string>;
  @Input() formCntrlName: string;
  @Input() formGroup: FormBuilder;
  @Input() label: string;
  @Input() options: string[];

  filteredOptions: Observable<any[]>;

  ngOnInit(): void {
    this.filteredOptions =
      this.formCntrl !== undefined &&
      this.formCntrl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        map((value) => (value ? this._filter(value) : this.options.slice()))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
