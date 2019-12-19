import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { MasterService } from 'src/app/_services/master.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { json } from '../../../../node_modules/@types/d3';

declare var $: any;

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css'],
  providers: [MessageService]
})
export class GenerateComponent implements OnInit {
  msgs: Message[] = [];
  generateForm: FormGroup;
  no_of_records: any;
  filtered_array: any;
  submitted = false;
  filter = [
    { value: 1, name: 'Gender' },
    { value: 2, name: 'Year' }
  ];

  constructor(public fb: FormBuilder, private mastService: MasterService, private messageService: MessageService) {
    this.no_of_records = environment.no_of_records;
  }

  ngOnInit() {
    this.generateForm = this.fb.group({
      gId: [''],
      noOfRecords: ['', Validators.required],
      year: ['', Validators.required],
      round: ['', Validators.required],
      percentage: ['', Validators.required],
      filter: new FormArray([])
    });
  }

  isFieldValid(field: string) {
    return !this.generateForm.get(field).valid && this.generateForm.get(field).touched;
  }

  // convenience getter for easy access to form fields
  get f() { return this.generateForm.controls; }

  FilterRecord() {
    this.submitted = true;

    if (this.generateForm.value.filter.length === 0) {
      return true;
    } else {
      this.generateForm.value.filterGender = '0';
      this.generateForm.value.filterYear = '0';
      for (let i = 0; i < this.generateForm.value.filter.length; i++) {
        if (this.generateForm.value.filter[i]) {
          if (this.generateForm.value.filter[i] === '1') {
            this.generateForm.value.filterGender = '1';
          } else if (this.generateForm.value.filter[i] === '2') {
            this.generateForm.value.filterYear = '1';
          }
        }
      }
    }

    if (this.generateForm.invalid) {
      return true;
    }

    const body = JSON.stringify(this.generateForm.value);
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

    // this.filtered_array = [
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    //   { id: 1, year: '2015', gender: 'male' },
    // ];
  }

  onCheckChange(event) {
    const formArray: FormArray = this.generateForm.get('filter') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

}
