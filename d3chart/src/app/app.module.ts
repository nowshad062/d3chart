import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './/layouts/layout.module';
import { ScriptLoaderService } from './_services/script-loader.service';
import { MasterService } from './_services/master.service';

// Import PrimeNG modules
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    TableModule,
    GrowlModule,
    NgxSpinnerModule
  ],
  providers: [ScriptLoaderService, MasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
