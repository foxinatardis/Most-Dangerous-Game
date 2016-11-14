// app-routing.module.ts

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthService } from "./auth.service";
import { LoginComponent } from "./login.component";
import { GameSelectionComponent } from "./game-selection.component";
import { WaitingRoomComponent } from "./waiting-room.component";
import { InGameComponent } from "./in-game.component";
import { GameHistoryComponent} from "./game-history.component";
import { ProfileComponent } from "./profile.component";
import { OptionsComponent } from "./options.component";
import { AboutComponent } from "./about.component";

const routes: Routes = [
	{path: "", component: AboutComponent },
	{path: "login", component: LoginComponent },
	{path: "game-selection", component: GameSelectionComponent, canActivate: [AuthService] },
	{path: "waiting-room", component: WaitingRoomComponent, canActivate: [AuthService] },
	{path: "in-game", component: InGameComponent, canActivate: [AuthService] },
	{path: "game-history", component: GameHistoryComponent, canActivate: [AuthService] },
	{path: "profile", component: ProfileComponent, canActivate: [AuthService] },
	{path: "options", component: OptionsComponent, canActivate: [AuthService] },
	{path: "about", component: AboutComponent}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {
	constructor(private authService: AuthService) {}
}
