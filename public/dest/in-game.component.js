"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var auth_service_1 = require("./auth.service");
var api_service_1 = require("./api.service");
var geo_service_1 = require("./geo.service");
var io = require("socket.io-client");
var InGameComponent = (function () {
    function InGameComponent(authService, apiService, geoService) {
        this.authService = authService;
        this.apiService = apiService;
        this.geoService = geoService;
        this.error = false;
        this.gameId = this.authService.user.currentGame;
    }
    InGameComponent.prototype.ngOnInit = function () {
        this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
        this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
        setInterval(this.sendLocation.bind(this), 15000);
        this.socket = io();
        // this.socket.emit("join", this.authService.user.name);
    };
    ;
    InGameComponent.prototype.update = function () {
        if (this.myLat && this.targetLat) {
            this.distanceToTarget = this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat);
            this.accuracy = this.myAcc + this.targetAcc;
            this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
            console.log("requirements met");
        }
        console.log("update() invoked");
        console.log("target lat, long, acc", this.targetLat, this.targetLong, this.targetAcc);
        console.log("my lat, long, acc", this.myLat, this.myLong, this.myAcc);
    };
    InGameComponent.prototype.resolution = function () {
        if (this.accuracy > 100) {
            return "red";
        }
        else if (this.accuracy > 50) {
            return "yellow";
        }
        else {
            return "green";
        }
    };
    InGameComponent.prototype.sendLocation = function () {
        console.log("sendLocation()");
        var toSend = {
            gameId: this.gameId,
            latitude: this.myLat,
            longitude: this.myLong,
            accuracy: this.myAcc,
            time: this.myTime,
            currentTarget: this.targetName
        };
        // this.apiService.postObs("/api/update-location", toSend).subscribe((res) => {
        // 	if (res) {
        // 		this.authService.user.score = res.score;
        // 	}
        // 	console.log("message from api/update-location: ", res);
        // });
        this.socket.emit("update-location", JSON.stringify(toSend));
    };
    InGameComponent.prototype.positionSuccess = function (pos) {
        var _this = this;
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        this.apiService.getObs("/api/target").subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
                if (res.targetName) {
                    _this.targetName = res.targetName;
                }
            }
            else {
                _this.targetName = res.targetName;
                console.log("res is: ", res);
                _this.targetLat = res.latitude;
                _this.targetLong = res.longitude;
                _this.targetAcc = res.accuracy;
                _this.targetTime = res.timestamp;
                _this.update();
                var joinData = {
                    name: _this.authService.user.name,
                    targetName: res.targetName,
                    lat: coor.latitude,
                    long: coor.longitude,
                    time: pos.timestamp,
                    acc: coor.accuracy
                };
                _this.socket.emit("join", joinData);
                console.log(joinData);
            }
        });
    };
    InGameComponent.prototype.positionErr = function (err) {
        console.log(err);
        this.error = true;
        this.errorMessage = "Sorry, something went wrong. Please reload and try again.";
    };
    InGameComponent.prototype.iMovedSuccess = function (pos) {
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        this.update();
    };
    InGameComponent.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    ;
    InGameComponent.prototype.deg = function (x) {
        return x * (180 / Math.PI);
    };
    ;
    InGameComponent.prototype.getDistance = function (mLong, mLat, tLong, tLat) {
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
    ;
    InGameComponent.prototype.getBearing = function (startLong, startLat, endLong, endLat) {
        startLat = this.rad(startLat);
        startLong = this.rad(startLong);
        endLat = this.rad(endLat);
        endLong = this.rad(endLong);
        var dLong = endLong - startLong;
        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0) {
                dLong = -(2.0 * Math.PI - dLong);
            }
            else {
                dLong = (2.0 * Math.PI + dLong);
            }
        }
        return (this.deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    };
    InGameComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div>\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h2>Target: {{targetName}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h3>Distance to Target: {{distanceToTarget}} meters</h3>\n\t\t\t<h3>Direction to Target: {{bearing}} degrees</h3>\n\t\t\t<h3 [style.color]=\"resolution()\">Accuracy: {{accuracy}} meters</h3>\n\t\t</div>\n\t\t<div *ngIf=\"error\">\n\t\t\t<h2 class=\"error\">{{errorMessage}}</h2>\n\t\t</div>\n\t\t<button class=\"button bottom\">Attack</button>\n\t",
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, api_service_1.ApiService, geo_service_1.GeoService])
    ], InGameComponent);
    return InGameComponent;
}());
exports.InGameComponent = InGameComponent;
//# sourceMappingURL=in-game.component.js.map