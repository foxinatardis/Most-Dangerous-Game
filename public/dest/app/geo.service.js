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
var api_service_1 = require("./api.service");
var GeoService = (function () {
    function GeoService(apiService) {
        this.apiService = apiService;
        this.positionOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000
        };
    }
    GeoService.prototype.postLocation = function () {
        navigator.geolocation.getCurrentPosition(this.postPositionSuccess.bind(this), this.handlePositionError.bind(this), this.positionOptions);
    };
    GeoService.prototype.getLocation = function (success, failure) {
        navigator.geolocation.getCurrentPosition(success, failure, this.positionOptions);
    };
    GeoService.prototype.postPositionSuccess = function (pos) {
        var coor = pos.coords;
        var time = pos.timestamp;
        var data = {
            location: {
                longitude: coor.longitude,
                latitude: coor.latitude,
                accuracy: coor.accuracy,
                timestamp: time
            }
        };
        this.apiService.postObs("/api/location", data).subscribe(function (res) {
            // todo update this to actually tell the user something useful
            if (res.error) {
                console.log(res.message);
            }
            console.log(res.message);
        });
    };
    GeoService.prototype.getPositionSuccess = function (pos) {
        var coor = pos.coords;
        var time = pos.timestamp;
        console.log(time);
        return {
            longitude: coor.longitude,
            latitude: coor.latitude,
            accuracy: coor.accuracy,
            timestamp: time
        };
    };
    GeoService.prototype.handlePositionError = function (err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    };
    return GeoService;
}());
GeoService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], GeoService);
exports.GeoService = GeoService;
//# sourceMappingURL=geo.service.js.map