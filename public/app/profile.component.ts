import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";


@Component({
	template: `
		<h2>Welcome: {{this.authService.user.name}}</h2>
		<h3>Your Score: {{this.authService.user.score}}</h3>
		<div class="button" (click)="gameSelect()">
			<p class="inside-button" *ngIf="this.authService.user.currentGame && this.authService.user.inGame">Enter Game</p>
			<p class="inside-button" *ngIf="this.authService.user.currentGame && !this.authService.user.inGame">Enter Waiting Room</p>
			<p class="inside-button" *ngIf="!this.authService.user.currentGame">Join or Create Game</p>
		</div>
		<div class="button" (click)="history()">
			<p class="inside-button">Game History</p>
		</div>
		<div class="button" (click)="options()">
			<p class="inside-button">Options</p>
		</div>
	`,
})
export class ProfileComponent {
	constructor(
		private router: Router,
		private apiService: ApiService,
		private authService: AuthService
	) { }

	ngOnInit() {}

	gameSelect() {
		if (this.authService.user.inGame) {
			this.router.navigate(["/in-game"]);
		} else if (this.authService.user.currentGame) {
			this.router.navigate(["/waiting-room"]);
		} else {
			this.router.navigate(["/game-selection"]);
		}
	}

	history() {
		this.router.navigate(["/game-history"]);
	}

	options() {
		this.router.navigate(["/options"]);
	}
}
