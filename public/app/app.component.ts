import { Component } from '@angular/core';


@Component({
	selector: 'assassin',
	template: `
		<nav>
			<a herf="/">Home</a>
			<a href="/game-selection">Create or Join</a>
		</nav>
		<router-outlet></router-outlet>
	`,

})
export class AppComponent {

}
