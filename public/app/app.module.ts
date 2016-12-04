import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";
import { GeoService } from "./geo.service";

import { AppComponent } from './app.component';
import { LandingComponent } from "./landing.component";
import { LoginComponent } from "./login.component";
import { GameSelectionComponent } from "./game-selection.component";
import { WaitingRoomComponent } from "./waiting-room.component";
import { InGameComponent } from "./in-game.component";
import { GameHistoryComponent } from "./game-history.component";
import { ProfileComponent } from "./profile.component";
import { OptionsComponent } from "./options.component";
import { AboutComponent } from "./about.component";
import { AdminComponent } from "./admin.component";

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		AppRoutingModule
	],
	providers: [
		ApiService,
		AuthService,
		GeoService
	],
	declarations: [
		AppComponent,
		LoginComponent,
		GameSelectionComponent,
		WaitingRoomComponent,
		InGameComponent,
		GameHistoryComponent,
		ProfileComponent,
		OptionsComponent,
		AboutComponent,
		AdminComponent,
		LandingComponent
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
