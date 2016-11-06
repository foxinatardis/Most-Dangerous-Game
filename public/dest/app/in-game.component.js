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
    }
    InGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.geoService.postLocation();
        this.apiService.getObs("/api/target").subscribe(function (res) {
            _this.targetName = res.targetName;
            console.log(res);
        });
    };
    ;
    return InGameComponent;
}());
InGameComponent = __decorate([
    core_1.Component({
        template: "\n\t\t<div>\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t</div>\n\t\t<div>\n\t\t\t<h2>Target: {{this.targetName}}</h2>\n\t\t</div>\n\t",
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        api_service_1.ApiService,
        geo_service_1.GeoService])
], InGameComponent);
exports.InGameComponent = InGameComponent;
//# sourceMappingURL=in-game.component.js.map