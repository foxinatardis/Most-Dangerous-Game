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
var OptionsComponent = (function () {
    function OptionsComponent(apiService, authService, router) {
        this.apiService = apiService;
        this.authService = authService;
        this.router = router;
        // display variables and functions
        this.selectionMade = false;
        this.result = false;
        this.resultMessage = "";
        this.displayChangePassword = false;
        // change password variables and functions
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
    }
    OptionsComponent.prototype.displayOptions = function () {
        this.result = false;
        this.resultMessage = "";
        this.displayChangePassword = false;
    };
    OptionsComponent.prototype.changePassword = function () {
        this.selectionMade = true;
        this.displayChangePassword = true;
    };
    OptionsComponent.prototype.passwordVerify = function () {
        if (this.newPassword === this.confirmPassword && this.newPassword.length >= 8) {
            return true;
        }
        return false;
    };
    OptionsComponent.prototype.sendPassword = function () {
        var _this = this;
        if (this.passwordVerify()) {
            var toSend = {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword
            };
            this.apiService.postObs("/api/change-password", toSend).subscribe(function (res) {
                _this.result = true;
                _this.resultMessage = res.message;
            });
        }
    };
    ;
    OptionsComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div *ngIf=\"!selectionMade && !result\">\n\t\t\t<div class=\"button\" (click)=\"changePassword()\" *ngIf=\"!selectionMade\">\n\t\t\t\t<p class=\"inside-button\">Change Password</p>\n\t\t\t</div>\n\t\t\t<div class=\"button\"></div>\n\t\t\t<div class=\"button\"></div>\n\t\t\t<div class=\"button\"></div>\n\t\t</div>\n\t\t<div *ngIf=\"selectionMade && !result\">\n\t\t\t<div *ngIf=\"displayChangePassword\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"oldPassword\" placeholder=\"Old Password\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"newPassword\" placeholder=\"New Password\">\n\t\t\t\t<input type=\"password\" [(ngModel)]=\"confirmPassword\" placeholder=\"Confirm New Password\">\n\t\t\t\t<h3 class=\"error\" *ngIf=\"!passwordVerify()\">Passwords must match and contain at least 8 characters</h3>\n\t\t\t\t<div class=\"button\" (click)=\"sendPassword()\">\n\t\t\t\t\t<p class=\"inside-button\">Change Password</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div *ngIf=\"result\">\n\t\t\t<h3>{{resultMessage}}</h3>\n\t\t\t<div class=\"button\" (click)=\"displayOptions()\">Back to Options</div>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, auth_service_1.AuthService, router_1.Router])
    ], OptionsComponent);
    return OptionsComponent;
}());
exports.OptionsComponent = OptionsComponent;
//# sourceMappingURL=options.component.js.map