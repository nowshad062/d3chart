import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'src/app/_services/master.service';

// const cytoscape = require('cytoscape');
declare var $: any;
declare var cytoscape: any;

@Component({
  selector: 'app-cytoscapejs',
  templateUrl: './cytoscapejs.component.html',
  styleUrls: ['./cytoscapejs.component.css']
})
export class CytoscapejsComponent implements OnInit {
  graphDisplay: boolean;
  generateForm: FormGroup;
  submitted = false;
  GlyElements: any;

  constructor(public fb: FormBuilder, private spinner: NgxSpinnerService, private mastService: MasterService) {
    this.graphDisplay = true;
  }

  ngOnInit() {
    this.generateForm = this.fb.group({
      nodes: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.generateForm.controls; }

  loadGraph() {
    // const GlyElements = {
    //   nodes: [
    //     { data: { id: 'a', color: '#fb7b95' } },
    //     { data: { id: 'b', color: '#fb7b95' } },
    //     { data: { id: 'c', color: '#fb7b95' } },
    //     { data: { id: 'd', color: '#fb7b95' } },
    //     { data: { id: 'e', color: '#fb7b95' } },
    //     { data: { id: 'f', color: '#fb7b95' } }
    //   ],
    //   edges: [
    //     { data: { id: 'ae', weight: 2, source: 'a', target: 'f', enzyme: '1993' } },
    //     { data: { id: 'ab', weight: 3, source: 'a', target: 'b', enzyme: '1993' } },
    //     { data: { id: 'be', weight: 4, source: 'b', target: 'e', enzyme: '1993' } },
    //     { data: { id: 'bc', weight: 5, source: 'b', target: 'c', enzyme: '1993' } },
    //     { data: { id: 'ce', weight: 1, source: 'c', target: 'e', enzyme: '1993' } },
    //     { data: { id: 'cd', weight: 2, source: 'c', target: 'd', enzyme: '1993' } },
    //     { data: { id: 'de', weight: 7, source: 'd', target: 'e', enzyme: '1993' } }
    //   ]
    // };

    let cy = cytoscape({
      container: document.getElementById('cy'),
      boxSelectionEnabled: false,
      autounselectify: true,
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(id)',
          'background-color': 'data(color)',
        })
        .selector('edge')
        .css({
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'width': 4,
          'line-color': '#ddd',
          'target-arrow-color': '#ddd'
        })
        .selector('node.highlight')
        .css({
          'border-color': '#FFF',
          'border-width': '2px'
        })
        .selector('node.semitransp')
        .css({
          'opacity': '0.5'
        })
        .selector('edge.highlight')
        .css({
          'mid-target-arrow-color': '#a020f0',
          'background-color': '#a020f0',
          'line-color': '#a020f0',
          'target-arrow-color': '#a020f0',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s',
          'label': 'data(enzyme)',
          'edge-text-rotation': 'autorotate',
          'text-margin-x': 50
        })
        .selector('edge.semitransp')
        .css({
          'opacity': '0.2'
        })
        .selector('edge.hover')
        .css({
          'background-color': '#a020f0',
          'line-color': '#a020f0',
          'target-arrow-color': '#a020f0',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s',
          'label': 'data(enzyme)',
          'edge-text-rotation': 'autorotate',
          'text-margin-x': 50
        }),
      elements: this.GlyElements,
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 10
      }
    });

    cy.on('mouseover', 'node', function (e) {
      var sel = e.target;
      cy.elements().difference(sel.outgoers()).not(sel).addClass('semitransp');
      sel.addClass('highlight').outgoers().addClass('highlight');
    });

    cy.on('mouseout', 'node', function (e) {
      var sel = e.target;
      cy.elements().removeClass('semitransp');
      sel.removeClass('highlight').outgoers().removeClass('highlight');
    });

    cy.on('mouseover', 'edge', function (e) {
      e.target.addClass('hover');
    });

    cy.on('mouseout', 'edge', function (e) {
      e.target.removeClass('hover');
    });

    this.graphDisplay = false;
  }

  getStats() {
    this.submitted = true;

    if (this.generateForm.invalid) {
      return true;
    }
    this.spinner.show();
    this.Anonymize();
    this.graphDisplay = true;
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  Anonymize() {
    // const body = this.generateForm.value;
    // this.mastService.exportData(body).subscribe(value => {
    //   if (value.status === 200) {
    //     this.GlyElements = value.result;
    //   } else {
    //   }
    // });
    const GlyElements = {
      nodes: [
        { data: { id: 'a', color: '#fb7b95' } },
        { data: { id: 'b', color: '#fb7b95' } },
        { data: { id: 'c', color: '#fb7b95' } },
        { data: { id: 'd', color: '#fb7b95' } },
        { data: { id: 'e', color: '#fb7b95' } },
        { data: { id: 'f', color: '#fb7b95' } }
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
    this.GlyElements = GlyElements;
    this.loadGraph();
  }

}
