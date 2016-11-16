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
var router_1 = require("@angular/router");
var api_service_1 = require("./api.service");
var LoginComponent = (function () {
    function LoginComponent(authService, router, apiService) {
        this.authService = authService;
        this.router = router;
        this.apiService = apiService;
        this.register = false;
        this.test = "";
        this.loginUser = {
            username: "",
            email: "",
            password: ""
        };
        this.password = "";
        this.registerError = "Passwords must match and be atleast 8 characters";
        this.error = "";
    }
    LoginComponent.prototype.newUser = function () {
        this.register = !this.register;
    };
    ;
    LoginComponent.prototype.sendRegistration = function () {
        var _this = this;
        if (this.passwordVerify()) {
            this.loginUser.username = this.loginUser.username.trim();
            this.loginUser.email = this.loginUser.email.trim();
            this.apiService.postObs("/api/signup", this.loginUser).subscribe(function (res) {
                if (res.error) {
                    _this.error = res.message;
                }
                else if (res.user) {
                    _this.authService.user = res.user;
                    _this.router.navigate(["/"]);
                }
            });
        }
    };
    ;
    LoginComponent.prototype.passwordVerify = function () {
        if (this.password === this.loginUser.password && this.password.length >= 8) {
            return true;
        }
        return false;
    };
    LoginComponent.prototype.sendLogin = function () {
        var _this = this;
        this.loginUser.username = this.loginUser.username.trim();
        this.loginUser.email = this.loginUser.email.trim();
        this.apiService.postObs("/api/login", this.loginUser).subscribe(function (res) {
            if (res.loggedIn) {
                _this.authService.user = res.userData[0];
                _this.router.navigate(["/profile"]);
            }
            else if (res.error) {
                _this.error = res.message;
            }
        });
    };
    LoginComponent.prototype.about = function () {
        this.router.navigate(["/about"]);
    };
    LoginComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<h2>The Most Dangerous Game</h2>\n\t\t<div>\n\t\t\t<h2 *ngIf=\"register\">Username: <span class=\"error\" *ngIf=\"error\">{{error}}</span></h2>\n\t\t\t<input type=\"text\" [(ngModel)]=\"loginUser.username\" placeholder=\"Username\" *ngIf=\"register\">\n\t\t\t<h3 class=\"error\" *ngIf=\"error\">{{error}}</h3>\n\t\t\t<h2>Email: <span class=\"error\" *ngIf=\"error\">{{error}}</span></h2>\n\t\t\t<input type=\"text\" [(ngModel)]=\"loginUser.email\" placeholder=\"Email\">\n\n\t\t\t<h2>Password: </h2>\n\t\t\t<input type=\"password\" [(ngModel)]=\"loginUser.password\" placeholder=\"Password\">\n\n\t\t\t<h2 *ngIf=\"register\">Re-enter Password: </h2>\n\t\t\t<input type=\"password\" [(ngModel)]=\"password\" placeholder=\"Password\" *ngIf=\"register\">\n\t\t\t<h3 class=\"error\" *ngIf=\"register && !passwordVerify()\">{{registerError}}</h3>\n\n\t\t\t<div>\n\t\t\t\t<div class=\"button\" (click)=\"sendLogin()\" *ngIf=\"!register\">\n\t\t\t\t\t<p class=\"inside-button\">Login</p>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"button\" (click)=\"sendRegistration()\" *ngIf=\"register\">\n\t\t\t\t\t<p class=\"inside-button\">Register</p>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"button\" (click)=\"newUser()\" *ngIf=\"register\">\n\t\t\t\t\t<p class=\"inside-button\">Login</p>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"button\" (click)=\"newUser()\" *ngIf=\"!register\">\n\t\t\t\t\t<p class=\"inside-button\">Create New User</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"button\" (click)=\"about()\">\n\t\t\t<p class=\"inside-button\">About</p>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, router_1.Router, api_service_1.ApiService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map