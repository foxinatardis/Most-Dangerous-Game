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
var GameHistoryComponent = (function () {
    function GameHistoryComponent(apiService) {
        this.apiService = apiService;
        this.games = [];
    }
    GameHistoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.apiService.getObs("/api/game-history").subscribe(function (res) {
            _this.gameIds = res.history;
            console.log("respose from /api/game-history", res);
            for (var i in _this.gameIds) {
                var toSend = { gameId: _this.gameIds[i] };
                _this.apiService.postObs("/api/game-stats", toSend).subscribe(function (res) {
                    _this.games.push(res.game);
                });
            }
        });
    };
    GameHistoryComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div>\n\t\t\t<ul *ngFor=\"let game of games\">\n\t\t\t\t<li class=\"listHead\">Creator: {{game.creator}}</li>\n\t\t\t\t<li>Start Date: {{game.startDate}}</li>\n\t\t\t\t<li>End Date: {{game.endDate}}</li>\n\t\t\t\t<li>Last Man Standing: {{game.activePlayers[0]}}</li>\n\t\t\t\t<li>\n\t\t\t\t\tKills:\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li *ngFor=\"let kill of game.kills\">{{kill}}</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t",
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService])
    ], GameHistoryComponent);
    return GameHistoryComponent;
}());
exports.GameHistoryComponent = GameHistoryComponent;
//# sourceMappingURL=game-history.component.js.map