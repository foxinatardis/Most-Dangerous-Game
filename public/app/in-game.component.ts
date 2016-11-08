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
			<h3>Distance to Target: {{distanceToTarget}} meters</h3>
			<h3>Direction to Target: {{bearing}} degrees</h3>
			<h3 [style.color]="resolution()">Accuracy: {{accuracy}} meters</h3>
		</div>
		<div *ngIf="error">
			<h1 class="error">{{errorMessage}}</h1>
		</div>
	`,
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private geoService: GeoService
	) { }

	targetName: string;
	error: boolean = false;
	errorMessage: string;
	myLong: number;
	myLat: number;
	myTime: number;
	myAcc: number;
	targetLong: number;
	targetLat: number;
	targetTime: number;
	targetAcc: number;
	targetLocation: any;
	distanceToTarget: number;
	directionToTarget: number;
	accuracy: number;
	bearing: number;

	ngOnInit() {
		this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
	};

	update() {
		if (this.myLat && this.targetLat) {
			this.distanceToTarget = this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat);
			this.accuracy = this.myAcc + this.targetAcc;
			this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
			console.log("requirements met");
		}
		console.log("update() invoked");
		console.log("target lat, long, acc", this.targetLat, this.targetLong, this.targetAcc);
		console.log("my lat, long, acc", this.myLat, this.myLong, this.myAcc);
	}

	resolution() {
		if (this.accuracy > 100) {
			return "red";
		} else if (this.accuracy > 50) {
			return "yellow";
		} else {
			return "green";
		}
	}

	positionSuccess(pos) {
		let coor = pos.coords;
		this.myLong = coor.longitude;
		this.myLat = coor.latitude;
		this.myTime = pos.timestamp;
		this.myAcc = coor.accuracy;

		this.apiService.getObs("/api/target").subscribe((res) => {
			if (res.error) {
				this.error = true;
				this.errorMessage = res.message;
				if (res.targetName) {
					this.targetName = res.targetName;
				}
			} else {
				this.targetName = res.targetName;
				console.log("res is: ", res);
				this.targetLat = res.latitude;
				this.targetLong = res.longitude;
				this.targetAcc = res.accuracy;
				this.targetTime = res.timestamp;
				this.update();
			}
		});

	}

	positionErr(err) {
		console.log(err);
	}

	rad(x) {
		return x * Math.PI / 180;
	};
	deg(x) {
		return x * (180 / Math.PI);
	};

	getDistance(mLong, mLat, tLong, tLat) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = this.rad(tLat - mLat);
		var dLong = this.rad(tLong - mLong);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(this.rad(mLat)) * Math.cos(this.rad(tLat)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};

	getBearing(startLong, startLat, endLong, endLat) {
		startLat = this.rad(startLat);
		startLong = this.rad(startLong);
		endLat = this.rad(endLat);
		endLong = this.rad(endLong);

		var dLong = endLong - startLong;

		var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
		if (Math.abs(dLong) > Math.PI) {
			if (dLong > 0.0) {
				dLong = -(2.0 * Math.PI - dLong);
			} else {
				dLong = (2.0 * Math.PI + dLong);
			}
		}

		return (this.deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
	}

}
