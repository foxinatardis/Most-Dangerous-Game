import { Component, OnInit } from "@angular/core";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({

	template: `
		<div *ngIf="gameAdmin">
			New players can not join once game has been launched.
			<div class="button" (click)="launchGame()">
				<p class="inside-button">Launch Game</p>
			</div>
		</div>
		<div>
			<h2>Players: </h2>
			<ul>
				<li *ngFor="let player of players">{{player}}</li>
			</ul>
		</div>
	`,
})
export class EnterGameComponent implements OnInit {
	constructor(
		private apiService: ApiService,
		private router: Router,
		private authService: AuthService
	) {}

	gameAdmin: boolean;
	players: Array<string>;

	launchGame() {
		this.apiService.postObs("/api/launch",
			{
				message: "launch game",
				gameId: this.authService.user.currentGame
			},
		).subscribe((res) => {
			if (res.success) {
				this.router.navigate(["/in-game"]);
			} // todo handle launch failure
		});
	};

	ngOnInit() {
		this.apiService.getObs("/api/game").subscribe((response) => {
			// todo do something with the response
			console.log(response);
			this.gameAdmin = response.gameAdmin;
			this.players = response.players;
		});
	}

}
