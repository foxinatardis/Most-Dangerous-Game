import { Component } from '@angular/core';


@Component({
	selector: 'assassin',
	template: `
		<nav>
			<a href="/">
				<div class="for-nav">
					<p class="p-nav">Home</p>
				</div>
			</a>
			<a href="/game-selection">
				<div class="for-nav">
					<p class="p-nav">Create or Join</p>
				</div>
			</a>
		</nav>
		<router-outlet></router-outlet>
	`,

})
export class AppComponent {

}
