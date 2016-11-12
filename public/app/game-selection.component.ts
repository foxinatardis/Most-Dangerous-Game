import { Component } from '@angular/core';
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<div *ngIf="start">
			<h2>Create or Join a Game</h2>
			<input type="text" placeholder="Username of Game Admin" [(ngModel)]="gameId">
			<div (click)="joinGame()" class="button">
				<p class="inside-button">Join Game</p>
			</div>
			<div (click)="createGame()" class="button">
				<p class="inside-button">Create Game</p>
			</div>
		</div>
		<div *ngIf="gameCreated">
			<h2>New Game Created</h2>
			<p class="styled">Your friends can join your game by entering your username in the join game field.</p>
			<button class="button" (click)="enterGame()">Enter Waiting Room</button>
		</div>
		<div *ngIf="gameJoined">
			<h2>{{gameId}}'s game joined successfully!!!</h2>
			<button class="button" (click)="enterGame()">Enter Waiting Room</button>
		</div>
	`,
	styles: [`

		h2 {
			text-align: center;
			font-family: sans-serif;
			color: #505BFF;
			text-shadow: 0 0 20px rgb(73, 125, 232);
		}

		p.styled {
			text-align: center;
			font-family: sans-serif;
			color: #505BFF;
			text-shadow: 0 0 20px rgb(73, 125, 232);
		}

		div.button {
			width: 90%;
			height: 50px;
			margin: 15px 15px 0px 15px;
			border-radius: 5px;
			background-color: #505BFF;
			-moz-box-shadow: 0px 0px 20px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 20px rgb(73, 125, 232);
			box-shadow: 0px 0px 20px rgb(73, 125, 232);
		}

		input {
			font-size: 20px;
			font-family: sans-serif;
			color: black;
			width: 90%;
			height: 50px;
			margin: 15px 15px 0px 15px;
			border-radius: 5px;
			background-color: #505BFF;
			border: 0;
			-moz-box-shadow: 0px 0px 20px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 20px rgb(73, 125, 232);
			box-shadow: 0px 0px 20px rgb(73, 125, 232);
		}

		p.inside-button {
			color: black;
			text-align: center;
			vertical-align: middle;
			line-height: 50px;
			font-size: 20px;
			font-family: sans-serif;
		}

	`]
})
export class GameSelectionComponent {
	constructor(
		private apiService: ApiService,
		private router: Router,
		private authService: AuthService
	) {}

	gameId: string;
	start: boolean = true;
	gameCreated: boolean = false;
	gameJoined: boolean = false;


	createGame() {
		this.apiService.postObs("/api/newGame", {message: "newgame"}).subscribe((response) => {
			if (response.gameId) {
				this.gameCreated = true;
				this.start = false;
				this.gameId = response.gameId;
				this.authService.user.currentGame = response.gameId;
			}
			// todo handle error creating game
		});
	}

	joinGame() {
		console.log("a");
		this.apiService.postObs("/api/joinGame", {message: "joingame", gameId: this.gameId}).subscribe((response) => {
			if (response.success) {
				this.start = false;
				this.gameJoined = true;
				this.authService.user.currentGame = response.gameId;
			} else {
				console.log("didn;t recieve success!");
				console.log(response.error);
				// todo handle error joining game
			}
			console.log(response.message);
		});
	}


	enterGame() {
		this.router.navigate(["waiting-room"]);
	}
}
