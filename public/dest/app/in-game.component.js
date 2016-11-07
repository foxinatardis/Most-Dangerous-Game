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
var InGameComponent = (function () {
    function InGameComponent(authService, apiService, geoService) {
        this.authService = authService;
        this.apiService = apiService;
        this.geoService = geoService;
        this.error = false;
        this.accuracy = -1;
    }
    // todo fix so distance gets calculated and displayed to the user
    InGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.myLocation = this.geoService.getLocation();
        this.apiService.getObs("/api/target").subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
            }
            else {
                _this.targetName = res.targetName;
                _this.apiService.getObs("/api/target/location").subscribe(function (res) {
                    if (res.error) {
                        _this.error = true;
                        _this.errorMessage = res.message;
                    }
                    else {
                        _this.targetLocation = {
                            latitude: res.lastLatitude,
                            longitude: res.lastLongitude,
                            accuracy: res.lastAccuracy,
                            timestamp: res.lastTimestamp
                        };
                        _this.accuracy = res.accuracy;
                    }
                });
            }
        });
    };
    ;
    InGameComponent.prototype.ngOnChanges = function () {
        if (this.myLocation && this.targetLocation) {
            this.distanceToTarget = this.getDistance(this.myLocation, this.targetLocation);
            this.accuracy = this.myLocation.accuracy + this.targetLocation.accuracy;
            console.log("requirements met");
        }
        console.log("callDistance invoked");
    };
    InGameComponent.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    ;
    InGameComponent.prototype.getDistance = function (p1, p2) {
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
    ;
    return InGameComponent;
}());
InGameComponent = __decorate([
    core_1.Component({
        template: "\n\t\t<div>\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h2>Target: {{targetName}}</h2>\n\t\t</div>\n\t\t<div>\n\t\t\t<h3>Distance to Target: {{distanceToTarget}}</h3>\n\t\t\t<h3>Accuracy: {{accuracy}}</h3>\n\t\t</div>\n\t\t<div *ngIf=\"error\">\n\t\t\t<h1 class=\"error\">{{errorMessage}}</h1>\n\t\t\t{{targetLocation}}\n\t\t</div>\n\t",
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_service_1.ApiService,
        geo_service_1.GeoService])
], InGameComponent);
exports.InGameComponent = InGameComponent;
//# sourceMappingURL=in-game.component.js.map