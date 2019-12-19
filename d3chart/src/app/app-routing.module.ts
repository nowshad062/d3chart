import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import PrimeNG modules
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { CalendarModule } from 'primeng/calendar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CytoscapeModule } from 'ngx-cytoscape';

import { LayoutComponent } from './/layouts/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CytoscapeComponent } from './pages/cytoscape/cytoscape.component';
import { D3chartComponent } from './pages/d3chart/d3chart.component';
import { ImportComponent } from './pages/import/import.component';
import { GenerateComponent } from './pages/generate/generate.component';
import { FieldErrorDisplayComponent } from './pages/field-error-display/field-error-display.component';
import { DataprocessingComponent } from './pages/dataprocessing/dataprocessing.component';
import { DeanonymizationComponent } from './pages/deanonymization/deanonymization.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { ArborjsComponent } from './pages/arborjs/arborjs.component';
import { CytoscapejsComponent } from './pages/cytoscapejs/cytoscapejs.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  {
    'path': '',
    'component': LayoutComponent,
    'children': [
      { path: 'index', component: HomeComponent },
      { path: 'cytoscape', component: CytoscapeComponent },
      { path: 'd3chart', component: D3chartComponent },
      { path: 'generate', component: GenerateComponent },
      { path: 'import', component: ImportComponent },
      { path: 'dataprocess', component: DataprocessingComponent },
      { path: 'deanonymization', component: DeanonymizationComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'arborjs', component: ArborjsComponent },
      { path: 'cytoscapejs', component: CytoscapejsComponent }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    GrowlModule,
    CalendarModule,
    NgxChartsModule,
    CytoscapeModule,
  ],
  declarations: [
    HomeComponent,
    FieldErrorDisplayComponent,
    CytoscapeComponent,
    D3chartComponent,
    GenerateComponent,
    ImportComponent,
    DataprocessingComponent,
    DeanonymizationComponent,
    AnalysisComponent,
    ArborjsComponent,
    CytoscapejsComponent
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
