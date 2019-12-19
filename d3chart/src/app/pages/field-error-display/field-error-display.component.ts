import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css']
})
export class FieldErrorDisplayComponent {
  @Input() form: FormGroup;
  @Input() submitted: boolean;
  @Input() fieldName: string;
  @Input() requiredErrorMsg: string;
  @Input() minErrorMsg: string;
  @Input() maxErrorMsg: string;

  isError(field: string) {
    return this.submitted && this.form.get(field).errors;
  }

  isRequired(field: string) {
    return this.form.get(field).errors.required;
  }

  isMin(field: string) {
    if (this.form.get(field).errors.min) {
      const val = this.form.get(field).value;
      const min = this.form.get(field).errors.min.min;
      if (!this.minErrorMsg) {
        this.minErrorMsg = 'Please Provide number should be greater then ' + min;
      }
      return (val < min) ? true : null;
    } else {
      return null;
    }
  }

  isMax(field: string) {
    if (this.form.get(field).errors.max) {
      const val = this.form.get(field).value;
      const max = this.form.get(field).errors.max.max;
      if (!this.maxErrorMsg) {
        this.maxErrorMsg = 'Please Provide number should be less then ' + max;
      }
      return (val > max) ? true : null;
    } else {
      return null;
    }
  }
}
