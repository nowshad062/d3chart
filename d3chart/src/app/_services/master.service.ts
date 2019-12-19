import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MasterService {
  constructor(private http: HttpClient) { }

  uploadCSVFile(value): any {
    return this.http.get(environment.API_ENDPOINT + environment.uploadCSVFile)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));
  }

  processRecord(value): any {
    return this.http.post(environment.API_ENDPOINT + environment.processRecord, value)
      .pipe(map((response: any) => {
        return response;
      }
      ));
  }

  anonymizationrecord(value): any {
    return this.http.post(environment.API_ENDPOINT + environment.anonymization, value)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));
  }

  exportData(): any {
    const GlyElements = {
      nodes: [
        { data: { id: 'a', color: '#61bffc' } },
        { data: { id: 'b', color: '#61bffc' } },
        { data: { id: 'c', color: '#61bffc' } },
        { data: { id: 'd', color: '#61bffc' } },
        { data: { id: 'e', color: '#61bffc' } },
        { data: { id: 'f', color: '#61bffc' } }
      ],
      edges: [
        { data: { id: 'ae', weight: 2, source: 'a', target: 'f', enzyme: '1997' } },
        { data: { id: 'ab', weight: 3, source: 'a', target: 'b', enzyme: '1997' } },
        { data: { id: 'be', weight: 4, source: 'b', target: 'e', enzyme: '1993' } },
        { data: { id: 'bc', weight: 5, source: 'b', target: 'c', enzyme: '1993' } },
        { data: { id: 'ce', weight: 1, source: 'c', target: 'e', enzyme: '1993' } },
        { data: { id: 'cd', weight: 2, source: 'c', target: 'd', enzyme: '1993' } },
        { data: { id: 'de', weight: 7, source: 'd', target: 'e', enzyme: '1993' } }
      ]
    };
    const response = {
      status: 200,
      result: GlyElements
    };
    return GlyElements;
    // return this.http.get(environment.API_ENDPOINT + environment.exportData)
    //   .pipe(map((response: Resultset) => {
    //       response.result = GlyElements;
    //       return response;
    //     }
    //   ));
  }

  analyzeData(value): any {
    const beginDate: Date = new Date(value.begin);
    const begin = (beginDate.toLocaleDateString('en-US')).replace('/','-').replace('/','-');

    const endDate: Date = new Date(value.end);
    const end = (endDate.toLocaleDateString('en-US')).replace('/','-').replace('/','-');

    // const begin = this.formatDate(value.begin);
    // const end = this.formatDate(value.end);
    return this.http.get(environment.API_ENDPOINT + environment.logReport + '/' + begin + '/' + end)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));

  }


  deanonymizationrecord1(value): any {
    return this.http.post(environment.API_ENDPOINT + environment.exportData, value)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));
  }

  deanonymizationrecord(value): any {
    // tslint:disable-next-line:max-line-length
    return this.http.get(environment.API_ENDPOINT + environment.exportData + '/' + value.noofSeeds + '/' + value.attribute + '/' + value.keepPrev)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));
  }

  fetchMaxSeeds(): any {
    return this.http.get(environment.API_ENDPOINT + environment.fetchMaxSeeds)
      .pipe(map((response: Resultset) => {
        return response;
      }
      ));
  }

  formatDate(date) {
    // tslint:disable-next-line:max-line-length
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return monthIndex +  '-' +  day + '-' + year;
  }

}

interface Resultset {
  status: number;
  message: string;
  responseType: ResponseType;
  result: any;
}
