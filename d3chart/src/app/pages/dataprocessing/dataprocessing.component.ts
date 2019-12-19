import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';

import { MasterService } from 'src/app/_services/master.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-dataprocessing',
  templateUrl: './dataprocessing.component.html',
  styleUrls: ['./dataprocessing.component.css'],
  providers: [MessageService]
})
export class DataprocessingComponent implements OnInit {
  msgs: Message[] = [];
  generateForm: FormGroup;
  anonymizeForm: FormGroup;
  generateFormSubmitted = false;
  anonymizeFormSubmitted = false;

  no_of_records: any;
  filtered_array: any;

  constructor(public fb: FormBuilder, private mastService: MasterService, private messageService: MessageService) {
    this.no_of_records = environment.no_of_records;
  }

  ngOnInit() {
    this.generateForm = this.fb.group({
      targetNode: ['', [Validators.required, Validators.max(5000), Validators.min(1)]],
      auxNode: ['', [Validators.required, Validators.max(5000), Validators.min(1)]],
      overlapPresentage: ['', [Validators.required, Validators.max(100), Validators.min(0)]]
    });
    this.anonymizeForm = this.fb.group({
     // year: ['', Validators.required],
      yearRange: ['', Validators.required],
      genderRetain: ['', [Validators.required, Validators.max(100), Validators.min(0)]]
    });
  }

  get f() { return this.generateForm.controls; }

  get f1() { return this.anonymizeForm.controls; }

  Generate() {
    this.generateFormSubmitted = true;
    if (this.generateForm.invalid) {
      return true;
    }

    const leftVal = ((this.generateForm.value.targetNode * this.generateForm.value.overlapPresentage) / 100);
    const rightVal = parseInt(this.generateForm.value.auxNode, 0);

    if (leftVal >  rightVal) {
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Overlap should be less than Auxiliary '
      });
      return true;
    }

    // const body = JSON.stringify(this.generateForm.value);
    const body = this.generateForm.value;
    this.mastService.processRecord(body).subscribe(value => {
      if (value.status === 200) {
        this.filtered_array = value.result;
        this.messageService.add({
          severity: 'success',
          summary: 'Process',
          detail: value.message
        });
      } else {
        this.msgs = [];
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: value.message
        });
      }
    });
  }

  Anonymize() {
    this.anonymizeFormSubmitted = true;
    if (this.anonymizeForm.invalid) {
      return true;
    }

    const body = this.anonymizeForm.value;
    this.mastService.anonymizationrecord(body).subscribe(value => {
      if (value.status === 200) {
        this.filtered_array = value.result;
        this.messageService.add({
          severity: 'success',
          summary: 'Process',
          detail: value.message
        });
      } else {
        this.msgs = [];
        this.msgs.push({
          severity: 'error',
          summary: 'Error Message',
          detail: value.message
        });
      }
    });
  }
}
