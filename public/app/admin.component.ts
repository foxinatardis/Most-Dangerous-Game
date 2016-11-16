import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";

@Component({
	template: `
		<h2>Welcome: {{this.authService.user.name}}</h2>
		<div *ngIf="!selectionMade && !result">

			<div class="button" (click)="selectEndGame()">
				<p class="inside-button">End Current Game</p>
			</div>

		</div>

		<div *ngIf="selectionMade && !result">

			<div *ngIf="displayEndGame">
				<h3>Are you sure you would like to end the current game for all players?</h3>
				<div class="button" (click)="unselect()">
					<p class="inside-button">No! Back to Admin</p>
				</div>
				<div class="button" (click)="endGame()">
					<p class="inside-button">Yes! End Current Game</p>
				</div>
			</div>

		</div>

		<div *ngIf="result">
			<h3>{{resultMessage}}</h3>
			<div class="button" (click)="unselect()">
				<p class="inside-button">Back to Admin Options</p>
			</div>
		</div>
	`,
})
export class AdminComponent {
	constructor(
		private apiService: ApiService,
		private authService: AuthService,
		private router: Router
	) { }


	selectionMade: boolean = false;
	error: boolean = false;
	errorMessage: string = "";
	result: boolean = false;
	resultMessage: string = "";

	displayEndGame: boolean = false;

	unselect() {
		if (!this.authService.user.gameAdmin) {
			this.router.navigate(["/options"]);
		} else {
			this.selectionMade = false;
			this.result = false;
			this.resultMessage = "";
			this.error = false;
			this.errorMessage = "";
			this.displayEndGame = false;
		}
	}

	selectEndGame() {
		this.selectionMade = true;
		this.displayEndGame = true;
	}

	endGame() {
		this.apiService.postObs("/api/end-game", {gameId: this.authService.user.currentGame}).subscribe((res) => {
			if (res.error) {
				this.error = true;
				this.errorMessage = res.message;
			} else {
				this.result = true;
				this.resultMessage = res.message;
				this.authService.user.currentGame = "";
				this.authService.user.inGame = false;
				this.authService.user.currentTarget = "";
				this.authService.user.gameAdmin = false;
			}
		});
	}

}
