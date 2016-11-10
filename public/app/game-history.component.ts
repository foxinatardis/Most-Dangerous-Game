import { Component } from "@angular/core";
import { ApiService } from "./api.service";
import { IGame } from "./IGame";

@Component({
	template: `
		<div>
			<ul *ngFor="let game of games">
				<li class="listHead">Creator: {{game.creator}}</li>
				<li>Start Date: {{game.startDate}}</li>
				<li>End Date: {{game.endDate}}</li>
				<li>Last Man Standing: {{game.activePlayers[0]}}</li>
				<li>
					Kills:
					<ul>
						<li *ngFor="let kill of game.kills">{{kill}}</li>
					</ul>
				</li>
			</ul>
		</div>
	`,
})
export class GameHistoryComponent {
	constructor(
		private apiService: ApiService
	) { }

	games: IGame[] = [];
	gameIds: any;

	ngOnInit() {
		this.apiService.getObs("/api/game-history").subscribe((res) => {
			this.gameIds = res.history;
			console.log("respose from /api/game-history", res);
			for (let i in this.gameIds) {
				let toSend = {gameId: this.gameIds[i]};
				this.apiService.postObs("/api/game-stats", toSend).subscribe((res) => {
					this.games.push(res.game);
				});
			}
		});
	}
}
