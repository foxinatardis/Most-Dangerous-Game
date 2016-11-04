import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";

import { AppComponent } from './app.component';
import { LoginComponent } from "./login.component";
import { GameSelectionComponent } from "./game-selection.component";
import { EnterGameComponent } from "./enter-game.component";
import { InGameComponent } from "./in-game.component";

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		AppRoutingModule
	],
	providers: [ ApiService, AuthService ],
	declarations: [
		AppComponent,
		LoginComponent,
		GameSelectionComponent,
		EnterGameComponent,
		InGameComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
