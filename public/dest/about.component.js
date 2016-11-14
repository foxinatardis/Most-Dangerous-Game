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
var AboutComponent = (function () {
    function AboutComponent(authService) {
        this.authService = authService;
    }
    AboutComponent.prototype.toLogin = function () {
        this.router.navigate(["/login"]);
    };
    AboutComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div class=\"button\" *ngIF=\"!this.authService.user\">\n\t\t\t<p class=\"inside-button\" (click)=\"toLogin()\">Login</p>\n\t\t</div>\n\t\t<div>\n\t\t\t<h2>Welcome to Most Dangerous Game</h2>\n\t\t\t<h3>How it works:</h3>\n\t\t\t<p>A User creates a new private game and tells their friends to join the game. You can join a game by entering the username of the game creator and hitting \"Join Game\".</p>\n\t\t\t<p>You will then be able to enter the waiting room which is where you can see the names of the other players who have joined while waiting for the game admin to launch the game.</p>\n\t\t\t<p>Once the game has been launched each player will be assigned a random target from the player list. While you are online tracking your target your location is visible to the player tracking you.</p>\n\t\t\t<p>The closer you are to your target the more likely your attempt to take them out is to succeed.</p>\n\t\t\t<p>After you have taken out your target your score will increase and you will take over the target that player was tracking.</p>\n\t\t\t<p>The game ends when there is only one player left.</p>\n\t\t\t<p>In future implementations you will be able to trade in points from your score for temporary bonuses such as invisible tracking or increased attack range.</p>\n\t\t\t<p>If you have any feedback on how to improve the game please feel free to email the creator at foxinatardis@gmail.com</p>\n\n\t\t<div>\n\n\t",
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map