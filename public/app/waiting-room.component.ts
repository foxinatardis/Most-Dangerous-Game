import { Component, OnInit } from "@angular/core";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { GeoService } from "./geo.service";
import * as io from "socket.io-client";

@Component({

	template: `
		<div *ngIf="gameAdmin">
			New players can not join once game has been launched.
			<div class="button" (click)="launchGame()">
				<p class="inside-button">Launch Game</p>
			</div>
		</div>
		<div *ngIf="!error">
			<h2>Players: </h2>
			<ul>
				<li *ngFor="let player of players">{{player}}</li>
			</ul>
		</div>
		<div *ngIf="error">
			<h3 class="error">{{errorMessage}}</h3>
		</div>
	`,
})
export class WaitingRoomComponent implements OnInit {
	constructor(
		private apiService: ApiService,
		private router: Router,
		private authService: AuthService,
		private geoService: GeoService
	) {}
	socket: any;
	gameAdmin: boolean;
	players: Array<string>;
	gameId: string = this.authService.user.currentGame;
	error: boolean = false;
	errorMessage: string = "";

	launchGame() {
		this.apiService.postObs("/api/launch",
			{
				message: "launch game",
				gameId: this.authService.user.currentGame
			},
		).subscribe((res) => {
			if (res.success) {
				this.socket.emit("launch", this.authService.user.currentGame);
			} else {
				this.error = true;
				this.errorMessage = res.message;
			}
		});
	};

	ngOnInit() {
		this.socket = io();
		this.apiService.getObs("/api/game").subscribe((response) => {
			if (response.error) {
				this.error = true;
				this.errorMessage = response.message;
			}
			this.gameAdmin = response.gameAdmin;
			this.players = response.players;
			let toSend = {
				gameId: this.authService.user.currentGame,
				name: this.authService.user.name
			};
			this.socket.emit("waiting", toSend);
		});
		this.geoService.postLocation();
		this.socket.on("launch", () => {
			this.authService.user.inGame = true;
			this.router.navigate(["/in-game"]);
		});
		this.socket.on("update waiting", (newPlayer) => {
			if (!this.players.includes(newPlayer)) {
				this.players.push(newPlayer);
			}
			console.log("recived waiting update, newPlayer is: ", newPlayer);
		});
	}

	ngOnDestroy() {
		this.socket.disconnect();
	}

}
