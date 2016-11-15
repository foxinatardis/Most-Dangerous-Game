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
var api_service_1 = require("./api.service");
var router_1 = require("@angular/router");
var auth_service_1 = require("./auth.service");
var GameSelectionComponent = (function () {
    function GameSelectionComponent(apiService, router, authService) {
        this.apiService = apiService;
        this.router = router;
        this.authService = authService;
        this.start = true;
        this.gameCreated = false;
        this.gameJoined = false;
        this.error = false;
        this.errorMessage = "";
    }
    GameSelectionComponent.prototype.createGame = function () {
        var _this = this;
        this.apiService.postObs("/api/newGame", { message: "newgame" }).subscribe(function (response) {
            if (response.error) {
                _this.error = true;
                _this.errorMessage = response.message;
            }
            else if (response.gameId) {
                _this.error = false;
                _this.errorMessage = "";
                _this.gameCreated = true;
                _this.start = false;
                _this.gameId = response.gameId;
                _this.authService.user.currentGame = response.gameId;
                _this.authService.user.gameAdmin = true;
            }
            else {
                _this.error = true;
                _this.errorMessage = "Error encountered, please try again.";
            }
        });
    };
    GameSelectionComponent.prototype.joinGame = function () {
        var _this = this;
        this.apiService.postObs("/api/joinGame", { message: "joingame", gameId: this.gameId }).subscribe(function (response) {
            if (response.error) {
                _this.error = true;
                _this.errorMessage = response.message;
            }
            else if (response.success) {
                _this.error = false;
                _this.errorMessage = "";
                _this.start = false;
                _this.gameJoined = true;
                _this.authService.user.currentGame = response.gameId;
            }
            else {
                _this.error = true;
                _this.errorMessage = "Error encountered, please try again.";
            }
        });
    };
    GameSelectionComponent.prototype.enterGame = function () {
        this.router.navigate(["waiting-room"]);
    };
    GameSelectionComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div *ngIf=\"start\">\n\t\t\t<h2>Create or Join a Game</h2>\n\t\t\t<input type=\"text\" placeholder=\"Username of Game Admin\" [(ngModel)]=\"gameId\">\n\t\t\t<div (click)=\"joinGame()\" class=\"button\">\n\t\t\t\t<p class=\"inside-button\">Join Game</p>\n\t\t\t</div>\n\t\t\t<div (click)=\"createGame()\" class=\"button\">\n\t\t\t\t<p class=\"inside-button\">Create Game</p>\n\t\t\t</div>\n\t\t</div>\n\t\t<div *ngIf=\"gameCreated\">\n\t\t\t<h2>New Game Created</h2>\n\t\t\t<p class=\"styled\">Your friends can join your game by entering your username in the join game field.</p>\n\t\t\t<button class=\"button\" (click)=\"enterGame()\">Enter Waiting Room</button>\n\t\t</div>\n\t\t<div *ngIf=\"gameJoined\">\n\t\t\t<h2>{{gameId}}'s game joined successfully!!!</h2>\n\t\t\t<button class=\"button\" (click)=\"enterGame()\">Enter Waiting Room</button>\n\t\t</div>\n\t\t<div *ngIf=\"error\">\n\t\t\t<h3 class=\"error\">{{errorMessage}}</h3>\n\t\t</div>\n\t",
            styles: ["\n\n\t\th2 {\n\t\t\ttext-align: center;\n\t\t\tfont-family: sans-serif;\n\t\t\tcolor: #505BFF;\n\t\t\ttext-shadow: 0 0 20px rgb(73, 125, 232);\n\t\t}\n\n\t\tp.styled {\n\t\t\ttext-align: center;\n\t\t\tfont-family: sans-serif;\n\t\t\tcolor: #505BFF;\n\t\t\ttext-shadow: 0 0 20px rgb(73, 125, 232);\n\t\t}\n\n\t\tdiv.button {\n\t\t\twidth: 90%;\n\t\t\theight: 50px;\n\t\t\tmargin: 15px 15px 0px 15px;\n\t\t\tborder-radius: 5px;\n\t\t\tbackground-color: #505BFF;\n\t\t\t-moz-box-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t}\n\n\t\tinput {\n\t\t\tfont-size: 20px;\n\t\t\tfont-family: sans-serif;\n\t\t\tcolor: black;\n\t\t\twidth: 90%;\n\t\t\theight: 50px;\n\t\t\tmargin: 15px 15px 0px 15px;\n\t\t\tborder-radius: 5px;\n\t\t\tbackground-color: #505BFF;\n\t\t\tborder: 0;\n\t\t\t-moz-box-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 20px rgb(73, 125, 232);\n\t\t}\n\n\t\tp.inside-button {\n\t\t\tcolor: black;\n\t\t\ttext-align: center;\n\t\t\tvertical-align: middle;\n\t\t\tline-height: 50px;\n\t\t\tfont-size: 20px;\n\t\t\tfont-family: sans-serif;\n\t\t}\n\n\t"]
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, auth_service_1.AuthService])
    ], GameSelectionComponent);
    return GameSelectionComponent;
}());
exports.GameSelectionComponent = GameSelectionComponent;
//# sourceMappingURL=game-selection.component.js.map