import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IErrorModal } from './error-modal.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements IErrorModal, OnInit {
  iconPath: string;
  title: string;
  text: string;
  text2: string;
  buttons: ('close' | 'retry' | 'abort')[] = ['close'];

  @Output() actionEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService
  ) {}

  ngOnInit() {}

  dismissAction(action?: 'close' | 'retry' | 'abort') {
    if (!action || action !== 'close') {
      this.bsModalService.setDismissReason(action);
    }
    this.bsModalRef.hide();
  }
}
