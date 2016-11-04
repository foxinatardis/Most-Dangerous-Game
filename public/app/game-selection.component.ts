import { Component } from '@angular/core';
import { ApiService } from "./api.service";

@Component({
	template: `
		<div *ngIf="!gameCreated">
			<h2>Create or Join a Game</h2>
			<input type="text" placeholder="Existing Game ID" [(ngModel)]="gameId">
			<div (click)="joinGame()" class="button">
				<p class="inside-button">Join Game</p>
			</div>
			<div (click)="createGame()" class="button">
				<p class="inside-button">Create Game</p>
			</div>
		</div>
		<div *ngIf="gameCreated">
			<h2>New Game Created</h2>
			<p class="styled">Your friends can join your game using the id below.</p>
			<p class="styled">Game: {{gameId}}</p>
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
	constructor(private apiService: ApiService) {}

	gameId: string;
	gameCreated: boolean = false;


	createGame() {
		// todo add code to post to /newGame on the server
		this.apiService.postObs("/api/newGame", {message: "newgame"}).subscribe((response) => {
			if (response.gameId) {
				this.gameCreated = true;
				this.gameId = response.gameId;

			}
		});
	}

	joinGame() {
		this.apiService.postObs("/joinGame", {message: "joingame"}).subscribe((response) => {
			console.log(response);
			// todo write this function
		});
	}

}
