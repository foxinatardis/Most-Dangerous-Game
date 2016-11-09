import { Component } from "@angular/core";
import { ApiService } from "./api.service";

@Component({
	template: `
		<div>
			<ul *ngFor="game of games">
				<li>Creator: {{game.creator}}</li>
				<li>Start Date: {{game.startDate}}</li>
				<li>End Date: {{game.endDate}}</li>
				<li>
					Kills:
					<ul>
						<li *ngFor="kill of game.kills">{{kill}}</li>
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

	games: any;

	ngOnInit() {
		this.apiService.getObs("/api/game-history").subscribe((res) => {
			this.games = res;
		});
	}
}
