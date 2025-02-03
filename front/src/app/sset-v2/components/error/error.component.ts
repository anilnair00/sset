import { Component, OnInit, Input } from '@angular/core';
import { Error } from '../../constants/error';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  private _error: 'GENERAL' | 'CONNECTIVITY' = 'GENERAL';

  @Input() set error(error: string) {
    switch (error) {
      case Error.Timeout:
        this._error = 'CONNECTIVITY';
        break;
      default:
        this._error = 'GENERAL';
    }
  }

  constructor() {}

  ngOnInit(): void {}

  get error(): string {
    return this._error;
  }

  retry() {
    window.location.reload();
  }
}
