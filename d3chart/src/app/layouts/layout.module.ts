import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { LayoutComponent } from './/layout.component';
import { AppHeader } from './/app-header/app-header.component';
import { AppFooter } from './/app-footer/app-footer.component';

@NgModule({
	declarations: [
	  LayoutComponent,
	  AppHeader,
	  AppFooter,
	],
	exports: [
	  LayoutComponent,
	  AppHeader,
	  AppFooter,
	],
	imports: [
		RouterModule,
	]
})
export class LayoutModule {
}