import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { GeoService } from "./geo.service";
import * as io from "socket.io-client";
declare let Compass: any;

@Component({
	template: `
		<div>
			<h2>Score: {{this.authService.user.score}}</h2>
		</div>
		<div *ngIf="!error">
			<h2 [style.color]="online()">Target: {{targetName}}</h2>
			<p *ngIf="targetOnline">Target Aquired: {{distanceToTarget}} meters from you location.</p>
			<p *ngIf="!targetOnline">Target Last seen {{distanceToTarget}} meters from your location.</p>
		</div>
		<div *ngIf="error">
			<h2 class="error">{{errorMessage}}</h2>
		</div>

		<div class="compassWrapper" id="compassWrapper" *ngIf="!error">
			<div class="compassQuarter one">
				<div class="compassSixty one">
					<div class="compassThird one"></div>
				</div>
			</div>
			<div class="compassQuarter two">
				<div class="compassSixty two">
					<div class="compassThird two"></div>
				</div>
			</div>
			<div class="compassQuarter three">
				<div class="compassSixty three">
					<div class="compassThird three"></div>
				</div>
			</div>
			<div class="compassQuarter four">
				<div class="compassSixty four">
					<div class="compassThird four"></div>
				</div>
				<p class="north">N</p>
				<div id="toDraw"></div>
			</div>
		</div>

		<button *ngIf="!takingAim && !attacking && !error" class="button bottom" (click)="takeAim()">Take Aim</button>
		<button *ngIf="takingAim && !attacking && !error" class="button bottom" (click)="attack()">Attack</button>
		<div *ngIf="attacking">
			<h2>{{attackMessage}}</h2>
		</div>
		<div *ngIf="!error && !attacking">
			<h3 [style.color]="resolution()">Accuracy: {{accuracy}} meters</h3>
		</div>
	`,
	styles: [`
		.compassWrapper {
			width: 80%;
			margin: auto;
			height: 0;
			padding-bottom: 80%;
			position: relative;
		}
		.compassQuarter {
			float: left;
			position: relative;
			width: 50%;
			height: 0;
			padding-bottom: 50%;
			box-sizing: border-box;
			border: 1px solid rgb(73, 125, 232);
		}
		.compassThird {

			width: 50%;
			height: 0;
			padding-bottom: 50%;
			position: absolute;

		}
		.compassSixty {

			width: 66%;
			height: 0;
			padding-bottom: 66%;
			position: absolute;

		}
		.north {
			transform: rotate(90deg);
			top: -1.5em;
			left: 101%;
			position: absolute;
		}
		.one {

			border-radius: 100% 0 0 0;
			-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			box-shadow: 0px 0px 7px rgb(73, 125, 232);

		}
		.one .compassSixty {
			top: 33.4%;
			left: 33.2%;
			border-top: 1px solid rgb(73, 125, 232);
			border-left: 1px solid rgb(73, 125, 232);
		}
		.one .compassThird {
			top: 50%;
			left: 50%;
			border-top: 1px solid rgb(73, 125, 232);
			border-left: 1px solid rgb(73, 125, 232);
		}

		.two {

			border-radius: 0 100% 0 0;
			-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			box-shadow: 0px 0px 7px rgb(73, 125, 232);

		}
		.two .compassSixty {
			top: 33.4%;
			border-top: 1px solid rgb(73, 125, 232);
			border-right: 1px solid rgb(73, 125, 232);
		}
		.two .compassThird {
			top: 50%;
			border-top: 1px solid rgb(73, 125, 232);
			border-right: 1px solid rgb(73, 125, 232);
		}
		.three {

			border-radius: 0 0 0 100%;
			-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			box-shadow: 0px 0px 7px rgb(73, 125, 232);

		}
		.three .compassSixty {
			left: 33.2%;
			border-bottom: 1px solid rgb(73, 125, 232);
			border-left: 1px solid rgb(73, 125, 232);
		}
		.three .compassThird {
			left: 50%;
			border-bottom: 1px solid rgb(73, 125, 232);
			border-left: 1px solid rgb(73, 125, 232);
		}
		.four {

			border-radius: 0 0 100% 0;
			border-bottom: 1px solid rgb(73, 125, 232);
			border-right: 1px solid rgb(73, 125, 232);
			-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);
			box-shadow: 0px 0px 7px rgb(73, 125, 232);
		}
		#toDraw {
			background-color: rgb(68, 120, 227);
			position: absolute;
			height: 6px;
			width: 6px;
			border-radius: 3px;
			-moz-box-shadow: 0px 0px 5px rgb(73, 125, 232);
			-webkit-box-shadow: 0px 0px 5px rgb(73, 125, 232);
			box-shadow: 0px 0px 5px rgb(73, 125, 232);
		}

	`]
})
export class InGameComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private geoService: GeoService
	) {	}

	takingAim: boolean;
	attacking: boolean = false;
	attackMessage: string;
	error: boolean = false;
	errorMessage: string;

	myLong: number;
	myLat: number;
	myTime: number;
	myAcc: number;
	myHeading: number;
	compass: any;
	compassWatch: any;

	targetName: string;
	targetLong: number;
	targetLat: number;
	targetTime: number;
	targetAcc: number;
	targetLocation: any;
	targetOnline: boolean = false;

	distanceToTarget: number;
	directionToTarget: number;
	accuracy: number;
	bearing: number;

	locationWatch: any;
	locationInterval: any;
	rapid: any;
	gameId: string = this.authService.user.currentGame;
	socket: any;

	initialized: boolean = false;


	ngOnInit() {

		this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
		this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
		this.locationInterval = setInterval(this.sendLocation.bind(this), 15000);
		this.socket = io();
		this.socket.on("target online", (data) => {
			if (data) {
				this.targetOnline = true;
				if (data.targetLat) {
					this.targetLat = data.targetLat;
					this.targetLong = data.targetLong;
					this.targetAcc = data.targetAcc;
					this.targetTime = data.targetTime;
					this.update();
				}
			} else {
				this.targetOnline = false;
			}
			console.log("data from socket 'target online' is: ", data);
		});

		this.socket.on("score", (data) => {
			this.authService.user.score = data;
		});

		this.socket.on("being watched", (data) => {
			this.rapidEmit(data);
			console.log("you are being watched: ", data);
		});

		this.socket.on("attack result", (data) => {
			if (data) {
				this.attackMessage = "Target taken out. Awaiting info on next target...";
				this.nextTarget();
			} else {
				this.attackMessage = "Target missed... ";
				setTimeout(function() {
					this.attacking = false;
					this.attackMessage = "";
				}.bind(this), 15000);
			}
		});

		this.socket.on("killed", (data) => {
			clearInterval(this.locationInterval);
			this.authService.user.currentGame = "";
			this.authService.user.gameAdmin = false;
			this.authService.user.inGame = false;
			this.authService.user.currentTarget = "";
			this.error = true;
			this.errorMessage = "You were killed by: " + data;
		});

		this.socket.on("end game", (data) => {
			this.attackMessage = "";
			this.error = true;
			this.errorMessage = "Game Over. You were the last man standing!!!";
		});

	};

	ngAfterContentInit() {
		if (!this.initialized) {
			this.initialized = true;
			console.log("after content init");
			this.compass = document.getElementById("compassWrapper");
			this.compassWatch = Compass.watch(function (heading) {
				this.compass.style.transform = "rotate(" + ((90 + heading) * -1) + "deg)";
			}.bind(this));
			Compass.noSupport(function () {
				this.compass.style.transform = "rotate(-90deg)";
			}.bind(this));
		}
	}

	ngOnDestroy() {
		Compass.unwatch(this.compassWatch);
		this.socket.disconnect();
		clearInterval(this.locationInterval);
		navigator.geolocation.clearWatch(this.locationWatch);
	}



// functions for styling text colors based on variables
	online() {
		if (this.targetOnline) {
			return "green";
		} return "cornflowerblue";
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

// functions for practical uses

	takeAim() {
		let data = {
			targetName: this.targetName,
			trackerName: this.authService.user.name
		};
		this.takingAim = true;
		this.socket.emit("take aim", data);
		console.log("take aim data: ", data);
		setInterval(function() {
			if (this.takingAim) {
				this.takingAim = false;
				this.attacking = false;
				this.attackMessage = "";
			}
		}.bind(this), 20000);
	}

	attack() {
		this.attacking = true;
		this.takingAim = false;
		this.attackMessage = "Confirming kill...";
		let data = {
			distance: this.distanceToTarget,
			accuracy: this.accuracy,
			targetName: this.targetName,
			gameId: this.authService.user.currentGame
		};
		this.socket.emit("attack", data);
	}

	nextTarget() {
		this.apiService.getObs("/api/target").subscribe((res) => {
			if (res.error) {
				this.error = true;
				this.errorMessage = res.message;
				if (res.targetName) {
					this.targetName = res.targetName;
				}
			} else {
				this.attacking = false;
				this.attackMessage = "";
				this.targetName = res.targetName;
				this.targetLat = res.latitude;
				this.targetLong = res.longitude;
				this.targetAcc = res.accuracy;
				this.targetTime = res.timestamp;
				this.update();
				let joinData: any = {
					name: this.authService.user.name,
					targetName: res.targetName,
					lat: this.myLat,
					long: this.myLong,
					time: this.myTime,
					acc: this.myAcc,
					score: this.authService.user.score
				};
				this.socket.emit("join", joinData);
			}
		});
	}

	rapidEmit(hunterName: string) {
		console.log("rapidEmit()");
		if (this.rapid) {
			clearInterval(this.rapid);
		}
		this.rapid = setInterval(function() {
			console.log("inside rapidEmit interval function");
			let data = {
				trackerName: hunterName,
				latitude: this.myLat,
				longitude: this.myLong,
				accuracy: this.myAcc,
				time: this.myTime
			};
			console.log("data inside rapidEmit interval funciton: ", data);
			this.socket.emit("give aim", data);
		}.bind(this), 1000);
		setTimeout(function() {
			clearInterval(this.rapid);
			this.takingAim = false;
			console.log("inside setTimeout function.");
		}.bind(this), 15000);
	}

	sendLocation() {
		console.log("sendLocation()");
		let toSend = {
			gameId: this.gameId,
			latitude: this.myLat,
			longitude: this.myLong,
			accuracy: this.myAcc,
			time: this.myTime,
			currentTarget: this.targetName
		};
		this.socket.emit("update-location", toSend);
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
				this.attacking = false;
				this.attackMessage = "";
				this.targetName = res.targetName;
				this.targetLat = res.latitude;
				this.targetLong = res.longitude;
				this.targetAcc = res.accuracy;
				this.targetTime = res.timestamp;
				this.update();
				let joinData: any = {
					name: this.authService.user.name,
					targetName: res.targetName,
					lat: coor.latitude,
					long: coor.longitude,
					time: pos.timestamp,
					acc: coor.accuracy,
					score: this.authService.user.score
				};
				this.socket.emit("join", joinData);
				this.compass = document.getElementById("compassWrapper");
			}
		});

	}

	positionErr(err) {
		console.log(err);
		this.error = true;
		this.errorMessage = "Unable to obtain your location, please make sure you have 'Location Services' turned on and try again.";
	}

	iMovedSuccess(pos) {
		let coor = pos.coords;
		this.myLong = coor.longitude;
		this.myLat = coor.latitude;
		this.myTime = pos.timestamp;
		this.myAcc = coor.accuracy;
		if (coor.heading) {
			this.myHeading = coor.heading;
		}
		console.log("locationWatch: ", pos);
		this.update();
	}

	update() {
		if (this.myLat && this.targetLat) {
			this.distanceToTarget = Math.floor(this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat));
			this.accuracy = Math.floor(this.myAcc + this.targetAcc);
			this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
			let toDraw = document.getElementById("toDraw");
			let toDrawX = Math.cos(this.rad(this.bearing)) * Math.min(this.distanceToTarget, 100);
			let toDrawY = Math.sin(this.rad(this.bearing)) * Math.min(this.distanceToTarget, 100);
			toDraw.style.left = toDrawX + "%";
			toDraw.style.top = toDrawY + "%";
		}
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
