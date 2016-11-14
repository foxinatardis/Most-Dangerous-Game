// app-routing.module.ts
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
var login_component_1 = require("./login.component");
var game_selection_component_1 = require("./game-selection.component");
var waiting_room_component_1 = require("./waiting-room.component");
var in_game_component_1 = require("./in-game.component");
var game_history_component_1 = require("./game-history.component");
var profile_component_1 = require("./profile.component");
var options_component_1 = require("./options.component");
var about_component_1 = require("./about.component");
var routes = [
    { path: "", component: profile_component_1.ProfileComponent, canActivate: [auth_service_1.AuthService] },
    { path: "login", component: login_component_1.LoginComponent },
    { path: "game-selection", component: game_selection_component_1.GameSelectionComponent, canActivate: [auth_service_1.AuthService] },
    { path: "waiting-room", component: waiting_room_component_1.WaitingRoomComponent, canActivate: [auth_service_1.AuthService] },
    { path: "in-game", component: in_game_component_1.InGameComponent, canActivate: [auth_service_1.AuthService] },
    { path: "game-history", component: game_history_component_1.GameHistoryComponent, canActivate: [auth_service_1.AuthService] },
    { path: "profile", component: profile_component_1.ProfileComponent, canActivate: [auth_service_1.AuthService] },
    { path: "options", component: options_component_1.OptionsComponent, canActivate: [auth_service_1.AuthService] },
    { path: "about", component: about_component_1.AboutComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule(authService) {
        this.authService = authService;
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map