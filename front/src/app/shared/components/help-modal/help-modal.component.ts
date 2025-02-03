import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {
  constructor(public modalRef: BsModalRef) {}

  ngOnInit() {}

  dismissAction() {
    this.modalRef.hide();
  }
}
