import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  HostListener,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  QueryList,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit, OnChanges {
  /** id of the input */
  @Input() inputId?: string;

  /** Label of the inout to display */
  @Input() label: string;

  /** Name of the component as we are using ngModel form */
  @Input() name: string;

  // @Input() readonly = false;

  @Input() required = false;

  /** value of the dropdown */
  @Input() public _value: any;

  /**
   * Get the required inputs
   */
  @Input() public options: any = [];

  /**
   * configuration options
   */
  @Input() public config: any = {};

  /**
   * Whether multiple selection or single selection allowed
   */
  @Input() public multiple: boolean = false;

  /**
   * Value
   */
  @Input() public disabled: boolean;

  /**
   * change event when value changes to provide user to handle things in change event
   */
  @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted when dropdown is open.
   */
  @Output() public open: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted when dropdown is open.
   */
  @Output() public close: EventEmitter<any> = new EventEmitter();

  /**
   * Toogle the dropdown list
   */
  public toggleDropdown: boolean = false;

  /**
   * Available items for selection
   */
  public availableItems: any = [];

  /**
   * Selected Items
   */
  public selectedItems: any = [];

  /**
   * Selection text to be Displayed
   */
  public selectedDisplayText: string = 'Select';

  /**
   * variable to track if clicked inside or outside of component
   */
  public clickedInside: boolean = false;

  /**
   * Hold the reference to available items in the list to focus on the item when scrolling
   */
  @ViewChildren('availableOption')
  public availableOptions: QueryList<ElementRef>;

  get getSelectedValue() {
    return this.selectedDisplayText;
  }

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor(public _elementRef: ElementRef) {
    this.multiple = false;
  }

  public onChange: any = () => {
    // empty
  };
  public onTouched: any = () => {
    // empty
  };

  /**
   * click listener for host inside this component i.e
   * if many instances are there, this detects if clicked inside
   * this instance
   */
  @HostListener('click')
  public clickInsideComponent() {
    this.clickedInside = true;
  }

  /**
   * click handler on documnent to hide the open dropdown if clicked outside
   */
  @HostListener('document:click')
  public clickOutsideComponent() {
    if (!this.clickedInside) {
      this.toggleDropdown = false;
      this.close.emit();
    }
    this.clickedInside = false;
  }

  /**
   * Component onInit
   */
  public ngOnInit() {
    if (typeof this.options !== 'undefined' && Array.isArray(this.options)) {
      this.availableItems = [
        ...this.options.sort(this.config.customComparator)
      ];
      this.initDropdownValuesAndOptions();
    }
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public writeValue(value: any, internal?: boolean) {
    if (value) {
      if (Array.isArray(value)) {
        if (this.multiple) {
          this.value = value;
        } else {
          this.value = value[0];
        }
      } else {
        this.value = value;
      }
      /* istanbul ignore else */
      if (this.selectedItems.length === 0) {
        if (Array.isArray(value)) {
          this.selectedItems = value;
        } else {
          this.selectedItems.push(value);
        }
        this.initDropdownValuesAndOptions();
      }
    } else {
      this.value = [];
      /* istanbul ignore else */
      if (!internal) {
        this.reset();
      }
    }
    /* istanbul ignore else */
    if (!internal) {
      this.reset();
    }
  }

  public reset() {
    this.selectedItems = [];
    this.availableItems = [...this.options.sort(this.config.customComparator)];
    this.initDropdownValuesAndOptions();
  }

  /**
   * Component onchage i.e when any of the input properties change
   * @param changes
   */
  public ngOnChanges(changes: SimpleChanges) {
    this.selectedItems = [];
    this.options = this.options || [];
    /* istanbul ignore else */
    if (changes.options) {
      this.availableItems = [
        ...this.options.sort(this.config.customComparator)
      ];
    }
    /* istanbul ignore else */
    if (
      changes.value &&
      JSON.stringify(changes.value.currentValue) === JSON.stringify([])
    ) {
      this.availableItems = [
        ...this.options.sort(this.config.customComparator)
      ];
    }
    this.initDropdownValuesAndOptions();
  }

  /**
   * Deselct a selected items
   * @param item:  item to be deselected
   * @param index:  index of the item
   */
  public deselectItem(item: any, index: number) {
    this.selectedItems.forEach((element: any, i: number) => {
      /* istanbul ignore else */
      if (item === element) {
        this.selectedItems.splice(i, 1);
      }
    });
    /* istanbul ignore else */
    if (!this.availableItems.includes(item)) {
      this.availableItems.push(item);
      this.availableItems.sort(this.config.customComparator);
    }
    this.selectedItems = [...this.selectedItems];
    this.availableItems = [...this.availableItems];
    this.valueChanged();
  }

  /**
   * Select an item
   * @param item:  item to be selected
   * @param index:  index of the item
   */
  public selectItem(item: string, index?: number) {
    /* istanbul ignore else */
    if (!this.multiple) {
      /* istanbul ignore else */
      if (this.selectedItems.length > 0) {
        this.availableItems.push(this.selectedItems[0]);
      }
      this.selectedItems = [];
      this.toggleDropdown = false;
    }

    this.availableItems.forEach((element: any, i: number) => {
      /* istanbul ignore else */
      if (item === element) {
        this.selectedItems.push(item);
        this.availableItems.splice(i, 1);
      }
    });

    this.selectedItems = [...this.selectedItems];
    this.availableItems = [...this.availableItems];
    this.selectedItems.sort(this.config.customComparator);
    this.availableItems.sort(this.config.customComparator);
    // this.searchText = null;
    this.valueChanged();
  }

  /**
   * When selected items changes trigger the chaange back to parent
   */
  public valueChanged() {
    this.writeValue(this.selectedItems, true);
    // this.valueChange.emit(this.value);
    this.change.emit({ value: this.value });
    this.setSelectedDisplayText();
  }

  /**
   * Toggle the dropdownlist on/off
   */
  public toggleSelectDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
    if (this.toggleDropdown) {
      this.open.emit();
    } else {
      this.close.emit();
    }
  }

  /**
   * initialize the config and other properties
   */
  private initDropdownValuesAndOptions() {
    const config: any = {
      displayKey: 'description',
      height: 'auto',
      search: false,
      placeholder: 'Select',
      searchPlaceholder: 'Search',
      limitTo: this.options.length,
      customComparator: undefined,
      noResultsFound: 'No results found!',
      moreText: 'more',
      searchOnKey: null,
      clearOnSelection: false
    };
    /* istanbul ignore else */
    if (this.config === 'undefined' || Object.keys(this.config).length === 0) {
      this.config = { ...config };
    }
    for (const key of Object.keys(config)) {
      this.config[key] = this.config[key] ? this.config[key] : config[key];
    }
    // Adding placeholder in config as default param
    this.selectedDisplayText = this.config['placeholder'];
    /* istanbul ignore else */
    if (this.value !== '' && typeof this.value !== 'undefined') {
      if (Array.isArray(this.value)) {
        this.selectedItems = this.value;
      } else {
        this.selectedItems[0] = this.value;
      }

      this.selectedItems.forEach((item: any) => {
        const ind = this.availableItems.findIndex(
          (aItem: any) => JSON.stringify(item) === JSON.stringify(aItem)
        );
        if (ind !== -1) {
          this.availableItems.splice(ind, 1);
        }
      });
    }
    this.setSelectedDisplayText();
  }

  /**
   * set the text to be displayed
   */
  private setSelectedDisplayText() {
    let text: string = this.selectedItems[0];
    /* istanbul ignore else */
    if (typeof this.selectedItems[0] === 'object') {
      text = this.selectedItems[0][this.config.displayKey];
    }

    if (this.multiple && this.selectedItems.length > 0) {
      this.selectedDisplayText =
        this.selectedItems.length === 1
          ? text
          : text +
            ` + ${this.selectedItems.length - 1} ${this.config.moreText}`;
    } else {
      this.selectedDisplayText =
        this.selectedItems.length === 0 ? this.config.placeholder : text;
    }
  }
}
