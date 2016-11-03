import { Component, OnInit } from "@angular/core";
import { ApiService } from "./api.service";

@Component({

	template: `
		<div *ngIf="gameAdmin">
			New players can not join once game has been launched.
			<button>Launch Game</button>
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
	constructor(private apiService: ApiService) {}

	gameAdmin: boolean;
	players: Array<string>;

	ngOnInit() {
		this.apiService.getObs("/api/game").subscribe((response) => {
			// todo do something with the response
			console.log(response);
			this.gameAdmin = response.gameAdmin;
			this.players = response.players;
		});
	}

}
