import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { GeoService } from "./geo.service";

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<div>
			<h2>Target: {{this.targetName}}</h2>
		</div>
	`,
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private geoService: GeoService
	) {  }

	targetName: string;

	ngOnInit() {
		this.geoService.postLocation();

		this.apiService.getObs("/api/target").subscribe((res) => {
			this.targetName = res.targetName;
			console.log(res);
		});
	};



}
