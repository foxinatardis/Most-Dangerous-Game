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
var router_1 = require("@angular/router");
var auth_service_1 = require("./auth.service");
var EnterGameComponent = (function () {
    function EnterGameComponent(apiService, router, authService) {
        this.apiService = apiService;
        this.router = router;
        this.authService = authService;
    }
    EnterGameComponent.prototype.launchGame = function () {
        var _this = this;
        this.apiService.postObs("/api/launch", {
            message: "launch game",
            gameId: this.authService.user.currentGame
        }).subscribe(function (res) {
            if (res.success) {
                _this.router.navigate(["/in-game"]);
            } // todo handle launch failure
        });
    };
    ;
    EnterGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.apiService.getObs("/api/game").subscribe(function (response) {
            // todo do something with the response
            console.log(response);
            _this.gameAdmin = response.gameAdmin;
            _this.players = response.players;
        });
    };
    EnterGameComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div *ngIf=\"gameAdmin\">\n\t\t\tNew players can not join once game has been launched.\n\t\t\t<div class=\"button\" (click)=\"launchGame()\">\n\t\t\t\t<p class=\"inside-button\">Launch Game</p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div>\n\t\t\t<h2>Players: </h2>\n\t\t\t<ul>\n\t\t\t\t<li *ngFor=\"let player of players\">{{player}}</li>\n\t\t\t</ul>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, auth_service_1.AuthService])
    ], EnterGameComponent);
    return EnterGameComponent;
}());
exports.EnterGameComponent = EnterGameComponent;
//# sourceMappingURL=enter-game.component.js.map