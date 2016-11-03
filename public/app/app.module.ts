import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { ApiService } from "./api.service";

import { AppComponent } from './app.component';
import { GameSelectionComponent } from "./game-selection.component";

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		RouterModule.forRoot([
			{path: "", component: GameSelectionComponent }
		])
	],
	providers: [ ApiService ],
	declarations: [
		AppComponent,
		GameSelectionComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
