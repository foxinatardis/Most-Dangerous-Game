import { Component } from "@angular/core";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<button (click)="getLocation()">Get Location</button>
		<h2>{{position}}</h2>
	`,
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
	) {  }

	position: any;
	getLocation() {
		// stub
		navigator.geolocation.getCurrentPosition((res) => {
			this.position = res;
		});
	}

	// ngOnInit() {
	//
	// }
}
