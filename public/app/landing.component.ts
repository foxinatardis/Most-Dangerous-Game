import { Component } from "@angular/core";
import { Router } from "@angular/router";


@Component({
	template: `
		<h2>Welcome to The Most Dangerous Game</h2>
		<p>A multiplayer mobile game of tag. Hunt down your friends in real life and kill them in the game.</p>
		<div class="button">
			<p class="inside-button" (click)="toLogin()">Login/Register</p>
		</div>
		<div class="button">
			<p class="inside-button" (click)="toAbout()">About the Game</p>
		</div>
	`,
})
export class LandingComponent {
	constructor(
		private router: Router
	) {  }

	toLogin() {
		this.router.navigate(["/login"]);
	}
	toAbout() {
		this.router.navigate(["/about"]);
	}

}
