import { AbstractControl, ValidationErrors } from '@angular/forms';

const validFileFormats: string[] = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

export function ValidateReceiptFile(
  control: AbstractControl
): ValidationErrors {
  const files: FileList = control.value;
  let errors: ValidationErrors = null;

  if (!files || !files.length) {
    errors = { required: true };
  } else if (files.length > 1) {
    errors = { maxlength: true };
  } else if (
    !validFileFormats.includes(files[0].type) ||
    files[0].name.substr(files[0].name.lastIndexOf('.') + 1) == 'jfif'
  ) {
    errors = { invalid: true };
  } else if (files[0].size > 5000000) {
    errors = { maxsize: true };
  }

  if (errors) {
    return errors;
  }
}
