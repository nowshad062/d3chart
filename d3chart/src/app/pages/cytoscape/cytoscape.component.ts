import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.css']
})
export class CytoscapeComponent implements OnInit {
  graphDisplay: boolean;
  generateForm: FormGroup;
  submitted = false;

  private _graphData: any = {
    nodes: [
      { data: { id: 'j', name: 'Jerry', weight: 65, faveColor: '#6FB1FC', faveShape: 'triangle' } },
      { data: { id: 'e', name: 'Elaine', weight: 45, faveColor: '#EDA1ED', faveShape: 'ellipse' } },
      { data: { id: 'k', name: 'Kramer', weight: 75, faveColor: '#86B342', faveShape: 'octagon' } },
      { data: { id: 'g', name: 'George', weight: 70, faveColor: '#F5A45D', faveShape: 'rectangle' } }
    ],
    edges: [
      { data: { source: 'j', target: 'e', faveColor: '#6FB1FC', strength: 90, label: 'J to E' } },
      { data: { source: 'j', target: 'k', faveColor: '#6FB1FC', strength: 70 } },
      { data: { source: 'j', target: 'g', faveColor: '#6FB1FC', strength: 80 } },

      { data: { source: 'e', target: 'j', faveColor: '#EDA1ED', strength: 95 } },
      { data: { source: 'e', target: 'k', faveColor: '#EDA1ED', strength: 60 }, classes: 'questionable' },

      { data: { source: 'k', target: 'j', faveColor: '#86B342', strength: 100 } },
      { data: { source: 'k', target: 'e', faveColor: '#86B342', strength: 100 } },
      { data: { source: 'k', target: 'g', faveColor: '#86B342', strength: 100 } },

      { data: { source: 'g', target: 'j', faveColor: '#F5A45D', strength: 90 } }
    ],
    minZoom: 0.5,
    maxZoom: 0.3
  };

  graphData1 = {
    nodes: [
      { data: { id: 'a', parent: 'b' }, position: { x: 215, y: 85 } },
      { data: { id: 'b' } },
      { data: { id: 'c', parent: 'b' }, position: { x: 300, y: 85 } },
      { data: { id: 'd' }, position: { x: 215, y: 175 } },
      { data: { id: 'e' } },
      { data: { id: 'f', parent: 'e' }, position: { x: 300, y: 175 } }
    ],
    edges: [
      { data: { id: 'ad', source: 'a', target: 'd' } },
      { data: { id: 'eb', source: 'e', target: 'b' } }
    ]
  };

  constructor(public fb: FormBuilder) {
    this.graphDisplay = false;
  }

  ngOnInit() {
    this.generateForm = this.fb.group({
      nodes: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.generateForm.controls; }

  getStats() {
    this.submitted = true;

    if (this.generateForm.invalid) {
      return true;
    }

    this.graphDisplay = true;

    // const cy = cytoscape({
    //   container: document.getElementById('cy'),
    //   elements: [
    //     { data: { id: 'j', parent: 'b' } }
    //   ],
    //   layout: {
    //     name: 'grid',
    //     directed: true,
    //     padding: 0
    //   },
    //   style: [
    //   ]
    // });
  }

  get graphData(): any {
    return this._graphData;
  }

  set graphData(value: any) {
    this._graphData = value;
  }

}
