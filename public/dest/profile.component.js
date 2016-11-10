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
var router_1 = require("@angular/router");
var api_service_1 = require("./api.service");
var auth_service_1 = require("./auth.service");
var ProfileComponent = (function () {
    function ProfileComponent(router, apiService, authService) {
        this.router = router;
        this.apiService = apiService;
        this.authService = authService;
    }
    ProfileComponent.prototype.ngOnInit = function () { };
    ProfileComponent.prototype.gameSelect = function () {
        if (this.authService.user.inGame) {
            this.router.navigate(["/in-game"]);
        }
        else if (this.authService.user.currentGame) {
            this.router.navigate(["/waiting-room"]);
        }
        else {
            this.router.navigate(["/game-selection"]);
        }
    };
    ProfileComponent.prototype.history = function () {
        this.router.navigate(["/game-history"]);
    };
    ProfileComponent.prototype.options = function () {
        this.router.navigate(["/options"]);
    };
    ProfileComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<h2>Welcome: {{this.authService.user.name}}</h2>\n\t\t<h3>Your Score: {{this.authService.user.score}}</h3>\n\t\t<div class=\"button\" (click)=\"gameSelect()\">\n\t\t\t<p class=\"inside-button\" *ngIf=\"this.authService.user.currentGame && this.authService.user.inGame\">Enter Game</p>\n\t\t\t<p class=\"inside-button\" *ngIf=\"this.authService.user.currentGame && !this.authService.user.inGame\">Enter Waiting Room</p>\n\t\t\t<p class=\"inside-button\" *ngIf=\"!this.authService.user.currentGame\">Join or Create Game</p>\n\t\t</div>\n\t\t<div class=\"button\" (click)=\"history()\">\n\t\t\t<p class=\"inside-button\">Game History</p>\n\t\t</div>\n\t\t<div class=\"button\" (click)=\"options()\">\n\t\t\t<p class=\"inside-button\">Options</p>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [router_1.Router, api_service_1.ApiService, auth_service_1.AuthService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
//# sourceMappingURL=profile.component.js.map