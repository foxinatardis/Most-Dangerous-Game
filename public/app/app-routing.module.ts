// app-routing.module.ts

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthService } from "./auth.service";
import { LoginComponent } from "./login.component";
import { GameSelectionComponent } from "./game-selection.component";
import { EnterGameComponent } from "./enter-game.component";
import { InGameComponent } from "./in-game.component";

const routes: Routes = [
	{path: "", component: LoginComponent },
	{path: "login", component: LoginComponent },
	{path: "game-selection", component: GameSelectionComponent },
	{path: "enter-game", component: EnterGameComponent },
	{path: "in-game", component: InGameComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {
	constructor(private authService: AuthService) {}
}
