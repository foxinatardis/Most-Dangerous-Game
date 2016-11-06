import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { GeoService } from "./geo.service";

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<button class="button" (click)="getLocation()">Get Location</button>
		<h2>{{position}}</h2>
	`,
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private geoService: GeoService
	) {  }

	position: any;

	getLocation() {
		this.geoService.postLocation();
	}

}
