import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'src/app/_services/master.service';
declare var $: any;
declare var cytoscape: any;

@Component({
  selector: 'app-deanonymization',
  templateUrl: './deanonymization.component.html',
  styleUrls: ['./deanonymization.component.css']
})
export class DeanonymizationComponent implements OnInit {
  msgs: Message[] = [];
  startForm: FormGroup;
  saveForm: FormGroup;
  startFormSubmitted = false;
  graphDisplay: boolean;
  GlyElements: any;
  maxSeeds: number;

  constructor(public fb: FormBuilder, private spinner: NgxSpinnerService, private mastService: MasterService) {
    this.graphDisplay = true;
  }

  ngOnInit() {
    this.startForm = this.fb.group({
      noofSeeds: ['', Validators.required],
      keepPrev: [''],
      profile: ['', Validators.required],
      structure: [''],
    });

    this.mastService.fetchMaxSeeds().subscribe(value => {
      // this.maxSeeds = 20;
      this.maxSeeds = value;
    });
  }

  get f() { return this.startForm.controls; }

  disableSeeds(e) {
    const control = this.startForm.get('noofSeeds');
    if (e.target.checked) {
      control.disable();
    } else {
      control.enable();
    }
  }

  Start() {

    this.startFormSubmitted = true;
    console.log('sdsa' + this.startForm.value.noofSeeds);

    let noofseeds = this.startForm.value.noofSeeds;
    if (noofseeds === '') {
      console.log('here')
      noofseeds = this.maxSeeds;
    }

    console.log('dfsdfs' + noofseeds);
    if (noofseeds === undefined) {
      noofseeds = this.maxSeeds;
    }


    if (noofseeds === null) {

      console.log('invalid 1');
      console.log('seeeed ' + this.startForm.value.noofSeeds);
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please provide No of Seeds less than or equal to ' + this.maxSeeds + '.'
      });

      return true;
    }

    if (noofseeds > this.maxSeeds) {
      console.log('invalid 2');
      this.msgs = [];
      this.msgs.push({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Please provide No of Seeds less than or equal to ' + this.maxSeeds + '.'
      });
      return true;
    }

    let attribute = 0;
    if (!this.startForm.value.profile && !this.startForm.value.structure) {
      return true;
    } else if (this.startForm.value.profile && this.startForm.value.structure) {
      attribute = 2;
    } else if (this.startForm.value.profile) {
      attribute = 0;
    } else if (this.startForm.value.structure) {
      attribute = 1;
    }

    this.spinner.show();


    const body = {
      noofSeeds: noofseeds,
      keepPrev: this.startForm.value.keepPrev === '' ? false : this.startForm.value.keepPrev,
      attribute: attribute
    };

    this.mastService.deanonymizationrecord(body).subscribe(value => {
      this.GlyElements = value;
      this.loadGraph();
      this.graphDisplay = true;
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    });
  }

  loadGraph() {
    $('#cy').empty();
    const cy = cytoscape({
      container: document.getElementById('cy'),
      boxSelectionEnabled: false,
      autounselectify: true,
      group: 'background-color',
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(id)',
          'background-color': 'data(color)',
        })
        .selector('edge')
        .css({
          'curve-style': 'bezier',
          'line-color': 'data(faveColor)',
          //'width': 'mapData(Weight,0.004,0.117,1,10)',
          'line-style': 'data(line_style)',
          'opacity': 0.666,
          'width': '3',
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
          'edge-text-rotation': 'autorotate',
          'text-margin-x': 50
        }),
      elements: this.GlyElements.elements,
      layout: {
        name: 'grid',
        directed: true,
        roots: '#a',
        padding: 30,
        fit: true,
        zoomFactor: 0.05, // zoom factor per zoom tick
        zoomDelay: 45, // how many ms between zoom ticks
        minZoom: 0.1, // min zoom level
        maxZoom: 10, // max zoom level
        fitPadding: 50, // padding when fitting
        panSpeed: 10, // how many ms in between pan ticks
        panDistance: 10, // max pan distance per tick
        // tslint:disable-next-line:max-line-length
        panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
        panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
        panInactiveArea: 8, // radius of inactive area in pan drag box
        panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
        autodisableForMobile: true,
        transform: function (node, position) { return position; },
      }
    });

    cy.on('mouseover', 'node', function (e) {
      const sel = e.target;
      cy.elements().difference(sel.outgoers()).not(sel).addClass('semitransp');
      sel.addClass('highlight').outgoers().addClass('highlight');
    });

    cy.on('mouseout', 'node', function (e) {
      const sel = e.target;
      cy.elements().removeClass('semitransp');
      sel.removeClass('highlight').outgoers().removeClass('highlight');
    });

    cy.on('mouseover', 'edge', function (e) {
      e.target.addClass('hover');
      $('#edgelabel').val(e.target.data().enzyme);
    });

    cy.on('mouseout', 'edge', function (e) {
      e.target.removeClass('hover');
      $('#edgelabel').val('');
    });

    this.graphDisplay = false;
  }
}

