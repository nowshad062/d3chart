import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3chart',
  templateUrl: './d3chart.component.html',
  styleUrls: ['./d3chart.component.css']
})
export class D3chartComponent implements OnInit {
  dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];
  svg: any;

  constructor() { }

  ngOnInit() {
    this.svg = d3.select('svg')
      .attr('height', '100%')
      .attr('width', '100%');

    this.svg.selectAll('rect')
      .data(this.dataArray)
      .enter().append('rect');
  }

}
