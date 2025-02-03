import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICellMetadata } from './ITableMetadata';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  loading: boolean;
  @Input() selectable = false;
  @Input() multiple = true;
  @Input() selectedRows: string[] = [];
  @Input() formSection: string;
  @Input() grouping = 0;
  @Input() paginate?: number;

  private _disabledSelectionRows: string[] = [];
  @Input() set disabledSelectionRows(value: string[]) {
    this._disabledSelectionRows = value;
  }

  get disabledSelectionRows(): string[] {
    return this._disabledSelectionRows;
  }

  columnKeys: string[];
  undefinedDisplay = '&mdash;';

  private _columns = {};
  @Input('columns') set columns(value: object) {
    if (!value) {
      value = {};
    }
    this._columns = value;
  }

  get columns(): object {
    return this._columns;
  }

  private _data: object[] = [];
  @Input('data') set data(value: object[]) {
    if (!value) {
      value = [];
    }
    this._data = value;
  }

  get data(): object[] {
    return this._data;
  }

  private _metadata: ICellMetadata[][] = [];
  @Input('metadata') set metadata(value: ICellMetadata[][]) {
    if (!value) {
      value = [];
    }
    this._metadata = value;
  }

  get metadata(): ICellMetadata[][] {
    return this._metadata;
  }

  currentPage = 1;

  get totalItems(): number {
    return this.data ? this.data.length : 0;
  }

  get pageSize(): number {
    return this.paginate;
  }

  get lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get dataView(): Object[] {
    if (this.paginate) {
      return this.data.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    } else {
      return this.data;
    }
  }

  get hasLinkCol(): boolean {
    return this.data.findIndex((v) => v['rowLink']) > -1;
  }

  @Output() selectedRowsChange: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();

  constructor() {}

  ngOnInit() {
    this.columnKeys = Object.keys(this._columns);
  }

  onSelectRow(index: number, selected: boolean) {
    if (this.selectable) {
      let sRows = [...this.selectedRows];

      if (
        this.disabledSelectionRows &&
        this.disabledSelectionRows.includes(index.toString())
      ) {
        return;
      }

      if (!selected) {
        sRows = sRows.filter((i) => i !== this.grouping + '-' + index);
      } else {
        if (this.multiple) {
          sRows.push(this.grouping + '-' + index);
        } else {
          sRows = [this.grouping + '-' + index];
        }
      }
      this.selectedRows = sRows;
      this.selectedRowsChange.emit(sRows);
    } else if (this.dataView[index]['rowLink']) {
      console.log('navigate to ' + this.dataView[index]['rowLink']);
    }
  }

  preventDuplicateSelect(event) {
    // To prevent duplicate action on row and checkbox
    event.stopPropagation();
    event.preventDefault();
  }

  isRowSelected(index: string): boolean {
    return this.selectedRows.findIndex((r) => r === index) > -1;
  }

  hasEllipsis(index: number, colkey: string): boolean {
    return (
      this.metadata &&
      this.metadata[index] &&
      this.metadata[index].findIndex(
        (s: ICellMetadata) => s.column === colkey && s.ellipsis === true
      ) > -1
    );
  }

  getTooltipContent(index: number, colkey: string): string {
    if (
      this.metadata &&
      this.metadata[index] &&
      this.metadata[index].findIndex(
        (s: ICellMetadata) => s.column === colkey && !!s.tooltip
      ) > -1
    ) {
      return this.metadata[index].find(
        (s: ICellMetadata) => s.column === colkey && !!s.tooltip
      ).tooltip;
    } else {
      return undefined;
    }
  }
}
