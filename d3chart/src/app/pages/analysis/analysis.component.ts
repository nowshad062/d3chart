import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { MasterService } from 'src/app/_services/master.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  msgs: Message[] = [];
  no_of_records: any;
  filtered_array: any;
  analyzeForm: FormGroup;
  resultForm: FormGroup;
  analyzeFormSubmitted = false;
  resultFormSubmitted = false;
  dataChart = [
    { value: 1, name: 'Seed' },
    { value: 2, name: 'Configuration' }
  ];
  // Map Variable declarations
  seedData: any;
  configurationData: any;
  view: any[] = [700, 300];
  colorScheme = {
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#AAAAAA']
  };
  schemeType = 'ordinal';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabelChart1 = 'Seeds';
  xAxisLabelChart2 = 'Configuration';
  showYAxisLabel = true;
  yAxisLabel = 'Accuracy';
  graphDisplay = false;

  constructor(public fb: FormBuilder, private spinner: NgxSpinnerService, private mastService: MasterService) {
    this.no_of_records = environment.no_of_records;
  }

  ngOnInit() {
    this.analyzeForm = this.fb.group({
      begin: ['', Validators.required],
      end: ['', Validators.required]
    });

    this.resultForm = this.fb.group({
      dataChart: new FormArray([])
    });
  }

  get f() { return this.resultForm.controls; }

  onCheckChange(event, ctrl) {
    const formArray: FormArray = this.resultForm.get(ctrl) as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      // find the unselected element
      let i = 0;

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

  Analyze() {
    this.analyzeFormSubmitted = true;

    if (this.analyzeForm.invalid) {
      return true;
    }

    this.spinner.show();

    const body = this.analyzeForm.value;
    this.mastService.analyzeData(body).subscribe(value => {
        this.filtered_array = value;
    });

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  Result() {
    this.resultFormSubmitted = true;

    if (this.resultForm.value.dataChart.length === 0) {
      return true;
    } else {
      this.resultForm.value.filterSeed = '0';
      this.resultForm.value.filterConfiguration = '0';
      for (let i = 0; i < this.resultForm.value.dataChart.length; i++) {
        if (this.resultForm.value.dataChart[i]) {
          if (this.resultForm.value.dataChart[i] === '1') {
            this.resultForm.value.filterSeed = '1';
          } else if (this.resultForm.value.dataChart[i] === '2') {
            this.resultForm.value.filterConfiguration = '1';
          }
        }
      }
    }

    if (this.resultForm.invalid) {
      return true;
    }

    this.spinner.show();

    const result = _.chain(this.filtered_array)
    .groupBy('noSeeds')
    .toPairs()
    .map(function (currentItem) {
        return _.fromPairs(_.zip(['name', 'series'], currentItem));
    })
    .value();

    const result1 = _.chain(this.filtered_array)
    .groupBy('configuration')
    .toPairs()
    .map(function (currentItem) {
        return _.fromPairs(_.zip(['name', 'series'], currentItem));
    })
    .value();

    this.seedData = [];

    for (let i = 0; i < result.length; i++) {
      const seedObj = {
        name: result[i].name,
        series: []
      };
      let congval = result[i].series[0].configuration;
      let count  = 0;
      let sum = 0.0;
      let avg = 0.0;
      for (let j = 0; j < result[i].series.length; j++) {
        if (result[i].series[j].configuration === congval) {
          count++;
          sum += result[i].series[j].accuracy;
          if (j === result[i].series.length - 1) {
            avg = sum / count;
            const seriesa = {
              name: 'cal ' + congval,
              value: avg
            };
            seedObj.series.push(seriesa);
          }
        } else {
          avg = sum / count;
          const seriesa = {
            name: 'cal ' + congval,
            value: avg
          };
          seedObj.series.push(seriesa);
          congval = result[i].series[j].configuration;
          sum = 0;
          avg = 0.0;
          count = 0;
          j--;
        }
      }
      this.seedData.push(seedObj);
    }

    this.configurationData = [];
    for (let i = 0; i < result1.length; i++) {
      const configObj = {
        name: result1[i].name,
        series: []
      };
      let seedval = result1[i].series[0].noSeeds;
      let count  = 0;
      let sum = 0.0;
      let avg = 0.0;
      for (let j = 0; j < result1[i].series.length; j++) {
        if (result1[i].series[j].noSeeds === seedval) {
          count++;
          sum += result1[i].series[j].accuracy;
          if (j === result1[i].series.length - 1) {
            avg = sum / count;
            const seriesb = {
              name: 'seed ' + seedval,
              value: avg
            };
            configObj.series.push(seriesb);
          }
        } else {
          avg = sum / count;
          const seriesb = {
            name: 'seed ' + seedval,
            value: avg
          };
          configObj.series.push(seriesb);
          seedval = result1[i].series[j].noSeeds;
          sum = 0;
          avg = 0.0;
          count = 0;
          j--;
        }
      }
      this.configurationData.push(configObj);
    }
    this.graphDisplay = true;
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

}
