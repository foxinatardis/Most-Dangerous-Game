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
var core_1 = require('@angular/core');
var auth_service_1 = require("./auth.service");
var api_service_1 = require("./api.service");
var router_1 = require("@angular/router");
var AppComponent = (function () {
    function AppComponent(authService, apiService, router) {
        this.authService = authService;
        this.apiService = apiService;
        this.router = router;
    }
    AppComponent.prototype.logout = function () {
        var _this = this;
        this.apiService.getObs("/logout").subscribe(function (res) {
            if (res.success) {
                delete _this.authService.user;
                _this.router.navigate(["/login"]);
            }
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'assassin',
            template: "\n\t\t<nav>\n\t\t\t<div class=\"for-nav\" *ngIf=\"this.authService.user\" (click)=\"this.router.navigate(['/profile'])\">\n\t\t\t\t<p class=\"p-nav\">Profile</p>\n\t\t\t</div>\n\t\t\t<div class=\"for-nav\" (click)=\"logout()\" *ngIf=\"this.authService.user\">\n\t\t\t\t<p class=\"p-nav\">Logout</p>\n\t\t\t</div>\n\t\t</nav>\n\t\t<router-outlet></router-outlet>\n\t",
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, api_service_1.ApiService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map