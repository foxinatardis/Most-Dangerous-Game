import { Component } from '@angular/core';
import { AuthService } from "./auth.service";


@Component({
	selector: 'assassin',
	template: `
		<nav>
			<a href="/" *ngIf="this.authService.user">
				<div class="for-nav">
					<p class="p-nav">Home</p>
				</div>
			</a>
			<!-- <a href="/game-selection">
				<div class="for-nav">
					<p class="p-nav">Create or Join</p>
				</div>
			</a> -->
			<a href="/game-history" *ngIf="this.authService.user">
				<div class="for-nav">
					<p class="p-nav">Game History</p>
				</div>
			</a>
		</nav>
		<router-outlet></router-outlet>
	`,

})
export class AppComponent {
	constructor(
		private authService: AuthService
	) {}

}
