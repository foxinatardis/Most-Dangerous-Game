// app-routing.module.ts

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthService } from "./auth.service";
import { LoginComponent } from "./login.component";
import { GameSelectionComponent } from "./game-selection.component";
import { WaitingRoomComponent } from "./waiting-room.component";
import { InGameComponent } from "./in-game.component";
import { GameHistoryComponent} from "./game-history.component";

const routes: Routes = [
	{path: "", component: LoginComponent },
	{path: "login", component: LoginComponent },
	{path: "game-selection", component: GameSelectionComponent },
	{path: "waiting-room", component: WaitingRoomComponent },
	{path: "in-game", component: InGameComponent },
	{path: "game-history", component: GameHistoryComponent}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {
	constructor(private authService: AuthService) {}
}
