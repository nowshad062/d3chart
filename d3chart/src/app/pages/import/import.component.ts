import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { MasterService } from 'src/app/_services/master.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [MessageService]
})
export class ImportComponent implements OnInit {
  msgs: Message[] = [];
  filedata: any;
  importForm: FormGroup;
  submitted = false;
  apiURL: string;

  constructor(public fb: FormBuilder, private mastService: MasterService, private messageService: MessageService) {
    this.apiURL = environment.API_ENDPOINT;
  }

  ngOnInit() {
    this.importForm = this.fb.group({
      csvfile: [null, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.importForm.controls; }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.filedata = event.target.files[0];
      const [csvfile] = event.target.files;
      reader.readAsDataURL(csvfile);

      reader.onload = () => {
        this.importForm.patchValue({
          csvfile: reader.result
        });
      };
    }
  }

  save() {
    this.submitted = true;
    // if (this.importForm.invalid) {
    //   return true;
    // }

    const formData: FormData = new FormData();
    formData.append('file', this.filedata);
    this.mastService.uploadCSVFile(formData).subscribe(value => {
      if (value.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Uploaded',
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
