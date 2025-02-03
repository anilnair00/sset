import { Component, OnInit, Input } from '@angular/core';
import { ErrorType } from '../../models/error.enum';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private _error: 'GENERAL' | 'CONNECTIVITY' = 'GENERAL';

  @Input() set error(error: string) {
    switch (error) {
      case ErrorType.TIMEOUT:
        this._error = 'CONNECTIVITY';
        break;
      default:
        this._error = 'GENERAL';
    }
  }

  get error(): string {
    return this._error;
  }

  constructor() {}

  ngOnInit(): void {}

  retry() {
    window.location.reload();
  }
}
