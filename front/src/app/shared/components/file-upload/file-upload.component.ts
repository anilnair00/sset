import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() formCntrl: FormControl<FileList>;
  @Input() formCntrlName: string;
  @Input() formGroup: FormGroup;
  @Input() loading: boolean;
  @Input() helperText?: string;
  @Input() invalidText?: string;
  @Input() maxLengthText?: string;
  @Input() maxSizeText?: string;
  @Input() notUploadedText?: string;
  @Input() requiredText?: string;
  @Output() onChange = new EventEmitter<FileList>();

  fileName: string = '';

  @HostListener('dragover', ['$event']) dragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public dragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) public drop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    let files: FileList = event.dataTransfer.files;
    this.onChange.emit(files);
  }

  onClickRemove() {
    this.formGroup.patchValue({ [this.formCntrlName]: null });
    this.formCntrl.markAsTouched();
    this.formCntrl.markAsDirty();
    this.fileName = '';
    this.onChange.emit(null);
  }

  onFileChange(event: Event) {
    const element = event.target as HTMLInputElement;
    const files: FileList = element.files;
    this.fileName = files[0].name.replace(/[^\u0000-\u007F]+/g, '');
    if (files.length > 0) {
      this.onChange.emit(files);
    }
  }
}
