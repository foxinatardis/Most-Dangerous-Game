import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable()
export class GeoService {
	constructor(private apiService: ApiService) { }

	postLocation() {
		navigator.geolocation.getCurrentPosition(
			this.postPositionSuccess.bind(this),
			this.handlePositionError.bind(this),
			this.positionOptions
		);
	}

	getLocation() {
		navigator.geolocation.getCurrentPosition(
			this.getPositionSuccess.bind(this),
			this.handlePositionError.bind(this),
			this.positionOptions
		);
	}

	postPositionSuccess(pos) {
		let coor = pos.coords;
		let time = pos.timestamp;

		let data = {
			location: {
				longitude: coor.longitude,
				latitude: coor.latitude,
				accuracy: coor.accuracy,
				timestamp: time
			}
		};

		this.apiService.postObs("/api/location", data).subscribe((res) => {
			// todo update this to actually tell the user something useful
			if (res.error) {
				console.log(res.message);
			}
			console.log(res.message);
		});
	}

	getPositionSuccess(pos) {
		let coor = pos.coords;
		let time = pos.timestamp;
		console.log(time);
		return	{
					longitude: coor.longitude,
					latitude: coor.latitude,
					accuracy: coor.accuracy,
					timestamp: time
				};
	}

	handlePositionError(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}

	positionOptions = {
		enableHighAccuracy: true,
		timeout: 15000,
		maximumAge: 1000
	};
}
