import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { GeoService } from "./geo.service";

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<div *ngIf="!error">
			<h2>Target: {{targetName}}</h2>
		</div>
		<div>
			<h3>Distance to Target: {{distanceToTarget}}</h3>
			<h3>Accuracy: {{accuracy}}</h3>
		</div>
		<div *ngIf="error">
			<h1 class="error">{{errorMessage}}</h1>
			{{targetLocation}}
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
	error: boolean = false;
	errorMessage: string;
	myLocation: any;
	targetLocation: any;
	distanceToTarget: number;
	directionToTarget: number;
	accuracy: number = -1;

	// todo fix so distance gets calculated and displayed to the user

	ngOnInit() {
		this.myLocation = this.geoService.getLocation();

		this.apiService.getObs("/api/target").subscribe((res) => {
			if (res.error) {
				this.error = true;
				this.errorMessage = res.message;
			} else {
				this.targetName = res.targetName;
				this.apiService.getObs("/api/target/location").subscribe((res) => {
					if (res.error) {
						this.error = true;
						this.errorMessage = res.message;
					} else {
						this.targetLocation = {
							latitude: res.lastLatitude,
							longitude: res.lastLongitude,
							accuracy: res.lastAccuracy,
							timestamp: res.lastTimestamp
						};
						this.accuracy = res.accuracy;
					}
				});
			}
		});
	};

	ngOnChanges() {
		if (this.myLocation && this.targetLocation) {
			this.distanceToTarget = this.getDistance(this.myLocation, this.targetLocation);
			this.accuracy = this.myLocation.accuracy + this.targetLocation.accuracy;
			console.log("requirements met");
		}
		console.log("callDistance invoked");
	}

	rad(x) {
		return x * Math.PI / 180;
	};

	getDistance(p1, p2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = this.rad(p2.latitude - p1.latitude);
		var dLong = this.rad(p2.longitude - p1.longitude);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};



}
