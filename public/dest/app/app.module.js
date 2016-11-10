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
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var app_routing_module_1 = require("./app-routing.module");
var api_service_1 = require("./api.service");
var auth_service_1 = require("./auth.service");
var geo_service_1 = require("./geo.service");
var app_component_1 = require("./app.component");
var login_component_1 = require("./login.component");
var game_selection_component_1 = require("./game-selection.component");
var enter_game_component_1 = require("./enter-game.component");
var in_game_component_1 = require("./in-game.component");
var game_history_component_1 = require("./game-history.component");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            app_routing_module_1.AppRoutingModule
        ],
        providers: [
            api_service_1.ApiService,
            auth_service_1.AuthService,
            geo_service_1.GeoService
        ],
        declarations: [
            app_component_1.AppComponent,
            login_component_1.LoginComponent,
            game_selection_component_1.GameSelectionComponent,
            enter_game_component_1.EnterGameComponent,
            in_game_component_1.InGameComponent,
            game_history_component_1.GameHistoryComponent
        ],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map