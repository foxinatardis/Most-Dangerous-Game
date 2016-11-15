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
var auth_service_1 = require("./auth.service");
var api_service_1 = require("./api.service");
var AdminComponent = (function () {
    function AdminComponent(apiService, authService, router) {
        this.apiService = apiService;
        this.authService = authService;
        this.router = router;
        this.selectionMade = false;
        this.error = false;
        this.errorMessage = "";
        this.result = false;
        this.resultMessage = "";
        this.displayEndGame = false;
    }
    AdminComponent.prototype.unselect = function () {
        this.selectionMade = false;
        this.result = false;
        this.resultMessage = "";
        this.error = false;
        this.errorMessage = "";
        this.displayEndGame = false;
    };
    AdminComponent.prototype.selectEndGame = function () {
        this.selectionMade = true;
    };
    AdminComponent.prototype.endGame = function () {
        var _this = this;
        this.apiService.postObs("/api/end-game", { gameId: this.authService.currentGame }).subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
            }
            else {
                _this.result = true;
                _this.resultMessage = res.message;
            }
        });
    };
    AdminComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div *ngIf=\"!selectionMade\">\n\n\t\t\t<div class=\"button\" (click)=\"selectEndGame()\">\n\t\t\t\t<p class=\"inside-button\">End Current Game</p>\n\t\t\t</div>\n\t\t\t\n\t\t</div>\n\n\t\t<div *ngIf=\"selectionMade\">\n\n\t\t\t<div *ngIf=\"displayEndGame\"\n\t\t\t\t<h3>Are you sure you would like to end the current game for all players?</h3>\n\t\t\t\t<div class=\"button\" (click)=\"unselect()\">\n\t\t\t\t\t<p class=\"inside-button\">No! Back to Admin</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"button\" (click)=\"endGame()\">\n\t\t\t\t\t<p class=\"inside-button\">Yes! End Current Game</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, auth_service_1.AuthService, router_1.Router])
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;
//# sourceMappingURL=admin.component.js.map