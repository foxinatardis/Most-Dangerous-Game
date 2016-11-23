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
var api_service_1 = require("./api.service");
var geo_service_1 = require("./geo.service");
var io = require("socket.io-client");
var InGameComponent = (function () {
    function InGameComponent(authService, apiService, geoService) {
        this.authService = authService;
        this.apiService = apiService;
        this.geoService = geoService;
        this.attacking = false;
        this.error = false;
        this.reloading = false;
        this.facingColor = "rgb(0, 0, 0)";
        this.buttonClass = "aim";
        this.targetOnline = false;
        this.gameId = this.authService.user.currentGame;
        this.initialized = false;
    }
    InGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
        this.locationInterval = setInterval(this.sendLocation.bind(this), 15000);
        this.socket = io();
        this.socket.on("connected", function () {
            _this.geoService.getLocation(_this.positionSuccess.bind(_this), _this.positionErr.bind(_this));
        });
        this.socket.on("target online", function (data) {
            if (!_this.attacking) {
                if (data) {
                    _this.targetOnline = true;
                    if (data.targetLat) {
                        _this.targetLat = data.targetLat;
                        _this.targetLong = data.targetLong;
                        _this.targetAcc = data.targetAcc;
                        _this.targetTime = data.targetTime;
                        _this.update();
                        _this.displayPing();
                    }
                }
                else {
                    _this.targetOnline = false;
                }
            }
            console.log("data from socket 'target online' is: ", data);
        });
        this.socket.on("score", function (data) {
            if (data) {
                _this.authService.user.score = data;
            }
        });
        this.socket.on("being watched", function (data) {
            _this.rapidEmit(data);
            console.log("you are being watched: ", data);
        });
        this.socket.on("attack result", function (data) {
            if (data.killshot) {
                _this.attackMessage = "Target taken out. Awaiting info on next target...";
                _this.nextTarget();
            }
            else {
                _this.attackMessage = data.message;
                _this.reloadCounter = 15;
                _this.reloading = true;
                _this.reloadInterval = setInterval(function () {
                    if (this.reloadCounter > 0) {
                        this.reloadCounter--;
                    }
                }.bind(_this), 1000);
                setTimeout(function () {
                    clearInterval(this.reloadInterval);
                    this.reloading = false;
                    this.attacking = false;
                    this.attackMessage = "";
                }.bind(_this), 15000);
            }
        });
        this.socket.on("killed", function (data) {
            clearInterval(_this.locationInterval);
            _this.authService.user.currentGame = "";
            _this.authService.user.gameAdmin = false;
            _this.authService.user.inGame = false;
            _this.authService.user.currentTarget = "";
            _this.error = true;
            _this.errorMessage = "You were killed by: " + data;
        });
        this.socket.on("end game", function (data) {
            _this.attackMessage = "";
            _this.error = true;
            _this.errorMessage = "Game Over. You were the last man standing!!!";
        });
    };
    ;
    InGameComponent.prototype.ngAfterViewInit = function () {
        if (!this.initialized) {
            this.initialized = true;
            console.log("after view init");
            this.compass = document.getElementById("compassWrapper");
            this.ping = document.getElementById("ping");
            console.log("ngAfterViewInit this.compass: ", this.compass);
            this.compassWatch = Compass.watch(function (heading) {
                heading = Math.floor(heading);
                this.compass.style.transform = "rotate(" + ((90 + heading) * -1) + "deg)";
                if (Math.abs(heading - this.bearing) < 15) {
                    this.facingColor = "rgb(17, 66, 69)";
                    this.facingTarget = true;
                    this.attackMessage = "";
                    this.buttonClass = "attack";
                }
                else {
                    this.facingColor = "rgb(0, 0, 0)";
                    this.facingTarget = false;
                    this.attackMessage = "Must be facing your target to ";
                    this.buttonClass = "aim";
                }
            }.bind(this));
        }
    };
    InGameComponent.prototype.ngOnDestroy = function () {
        Compass.unwatch(this.compassWatch);
        this.socket.disconnect();
        clearInterval(this.locationInterval);
        navigator.geolocation.clearWatch(this.locationWatch);
        clearInterval(this.pingInterval);
    };
    // functions for styling text colors based on variables
    InGameComponent.prototype.online = function () {
        if (this.targetOnline) {
            return "green";
        }
        return "cornflowerblue";
    };
    InGameComponent.prototype.resolution = function () {
        if (this.accuracy > 100) {
            return "red";
        }
        else if (this.accuracy > 50) {
            return "yellow";
        }
        else {
            return "green";
        }
    };
    InGameComponent.prototype.displayPing = function () {
        clearTimeout(this.pingTimeout);
        if (!this.attacking) {
            this.clearPing();
            var width_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("width"), 10);
            var height_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("height"), 10);
            var radius_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("border-radius"), 10);
            var top_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("top"), 10);
            var left_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("left"), 10);
            var opacity_1 = parseInt(window.getComputedStyle(this.ping).getPropertyValue("opacity"), 10);
            this.pingInterval = setInterval(function () {
                console.log("pingInterval");
                width_1 += 2;
                height_1 += 2;
                radius_1 += 1;
                top_1 -= 1;
                left_1 -= 1;
                opacity_1 -= .02;
                this.ping.style.height = height_1 + "px";
                this.ping.style.width = width_1 + "px";
                this.ping.style.borderRadius = radius_1 + "px";
                this.ping.style.top = top_1 + "px";
                this.ping.style.left = left_1 + "px";
                this.ping.style.opacity = opacity_1 + "";
            }.bind(this), 1000 / 30);
            this.pingTimeout = setTimeout(this.clearPing.bind(this), 2000);
        }
    };
    InGameComponent.prototype.clearPing = function () {
        clearInterval(this.pingInterval);
        this.ping.style.height = "6px";
        this.ping.style.width = "6px";
        this.ping.style.borderRadius = "3px";
        this.ping.style.top = "0px";
        this.ping.style.left = "0px";
        this.ping.style.opacity = 1;
    };
    // functions for practical uses
    InGameComponent.prototype.takeAim = function () {
        var data = {
            targetName: this.targetName,
            trackerName: this.authService.user.name
        };
        this.takingAim = true;
        this.socket.emit("take aim", data);
        console.log("take aim data: ", data);
        this.aimInterval = setInterval(function () {
            if (this.takingAim) {
                this.takingAim = false;
                this.attacking = false;
                this.attackMessage = "";
            }
        }.bind(this), 20000);
    };
    InGameComponent.prototype.attack = function () {
        if (this.facingTarget) {
            clearInterval(this.aimInterval);
            this.attacking = true;
            this.takingAim = false;
            this.attackMessage = "Confirming kill...";
            var data = {
                distance: this.distanceToTarget,
                accuracy: this.myAcc,
                targetName: this.targetName,
                gameId: this.authService.user.currentGame
            };
            this.socket.emit("attack", data);
        }
    };
    InGameComponent.prototype.nextTarget = function () {
        var _this = this;
        this.apiService.getObs("/api/target").subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
                if (res.targetName) {
                    _this.targetName = res.targetName;
                }
            }
            else {
                _this.attacking = false;
                _this.attackMessage = "";
                _this.targetName = res.targetName;
                _this.targetLat = res.latitude;
                _this.targetLong = res.longitude;
                _this.targetAcc = res.accuracy;
                _this.targetTime = res.timestamp;
                _this.update();
                var joinData = {
                    name: _this.authService.user.name,
                    targetName: res.targetName,
                    lat: _this.myLat,
                    long: _this.myLong,
                    time: _this.myTime,
                    acc: _this.myAcc,
                    score: _this.authService.user.score
                };
                _this.socket.emit("join", joinData);
            }
        });
    };
    InGameComponent.prototype.rapidEmit = function (hunterName) {
        console.log("rapidEmit()");
        if (this.rapid) {
            clearInterval(this.rapid);
        }
        this.rapid = setInterval(function () {
            console.log("inside rapidEmit interval function");
            var data = {
                trackerName: hunterName,
                latitude: this.myLat,
                longitude: this.myLong,
                accuracy: this.myAcc,
                time: this.myTime
            };
            console.log("data inside rapidEmit interval funciton: ", data);
            this.socket.emit("give aim", data);
        }.bind(this), 1000);
        setTimeout(function () {
            clearInterval(this.rapid);
            this.takingAim = false;
            console.log("inside setTimeout function.");
        }.bind(this), 15000);
    };
    InGameComponent.prototype.sendLocation = function () {
        console.log("sendLocation()");
        var toSend = {
            gameId: this.gameId,
            latitude: this.myLat,
            longitude: this.myLong,
            accuracy: this.myAcc,
            time: this.myTime,
            currentTarget: this.targetName
        };
        this.socket.emit("update-location", toSend);
    };
    InGameComponent.prototype.positionSuccess = function (pos) {
        var _this = this;
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        this.apiService.getObs("/api/target").subscribe(function (res) {
            if (res.error) {
                _this.error = true;
                _this.errorMessage = res.message;
                if (res.targetName) {
                    _this.targetName = res.targetName;
                }
            }
            else {
                _this.attacking = false;
                _this.attackMessage = "";
                _this.targetName = res.targetName;
                _this.targetLat = res.latitude;
                _this.targetLong = res.longitude;
                _this.targetAcc = res.accuracy;
                _this.targetTime = res.timestamp;
                _this.update();
                var joinData = {
                    name: _this.authService.user.name,
                    targetName: res.targetName,
                    lat: coor.latitude,
                    long: coor.longitude,
                    time: pos.timestamp,
                    acc: coor.accuracy,
                    score: res.userScore
                };
                _this.socket.emit("join", joinData);
            }
        });
    };
    InGameComponent.prototype.positionErr = function (err) {
        // console.log(err);
        this.error = true;
        this.errorMessage = "Unable to obtain your location, please make sure you have 'Location Services' turned on and try again.";
    };
    InGameComponent.prototype.iMovedSuccess = function (pos) {
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = Math.floor(coor.accuracy);
        // console.log("locationWatch: ", pos);
        this.update();
    };
    InGameComponent.prototype.update = function () {
        if (!this.attacking && this.myLat && this.targetLat) {
            this.distanceToTarget = Math.floor(this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat));
            this.accuracy = Math.floor(this.myAcc + this.targetAcc);
            this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
            var toDraw = document.getElementById("toDraw");
            var toDrawX = Math.cos(this.rad(this.bearing)) * Math.min(this.distanceToTarget, 100);
            var toDrawY = Math.sin(this.rad(this.bearing)) * Math.min(this.distanceToTarget, 100);
            toDraw.style.left = toDrawX + "%";
            toDraw.style.top = toDrawY + "%";
        }
    };
    InGameComponent.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    ;
    InGameComponent.prototype.deg = function (x) {
        return x * (180 / Math.PI);
    };
    ;
    InGameComponent.prototype.getDistance = function (mLong, mLat, tLong, tLat) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(tLat - mLat);
        var dLong = this.rad(tLong - mLong);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(mLat)) * Math.cos(this.rad(tLat)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };
    ;
    InGameComponent.prototype.getBearing = function (startLong, startLat, endLong, endLat) {
        startLat = this.rad(startLat);
        startLong = this.rad(startLong);
        endLat = this.rad(endLat);
        endLong = this.rad(endLong);
        var dLong = endLong - startLong;
        var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
        if (Math.abs(dLong) > Math.PI) {
            if (dLong > 0.0) {
                dLong = -(2.0 * Math.PI - dLong);
            }
            else {
                dLong = (2.0 * Math.PI + dLong);
            }
        }
        return (this.deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
    };
    InGameComponent = __decorate([
        core_1.Component({
            template: "\n\t\t<div *ngIf=\"error\">\n\t\t\t<h2 class=\"error\">{{errorMessage}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t\t<h2 [style.color]=\"online()\">Target: {{targetName}}</h2>\n\t\t\t<p *ngIf=\"targetOnline\">Target Aquired: {{distanceToTarget}} meters from your location.</p>\n\t\t\t<p *ngIf=\"!targetOnline\">Target Last seen {{distanceToTarget}} meters from your location.</p>\n\t\t\t<div *ngIf=\"attacking\" [hidden]=\"reloading\">\n\t\t\t\t<h2>{{attackMessage}}</h2>\n\t\t\t</div>\n\t\t\t<div *ngIf=\"reloading\">\n\t\t\t\t<h3>Reloading...{{reloadCounter}}</h3>\n\t\t\t\t<p class=\"reload\"></p>\n\t\t\t</div>\n\t\t\t<div class=\"compassWrapper\" id=\"compassWrapper\" [hidden]=\"attacking\">\n\t\t\t\t<div class=\"compassQuarter one\" [style.background-color]=\"facingColor\">\n\t\t\t\t\t<div class=\"compassSixty one\">\n\t\t\t\t\t\t<div class=\"compassThird one\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"compassQuarter two\" [style.background-color]=\"facingColor\">\n\t\t\t\t\t<div class=\"compassSixty two\">\n\t\t\t\t\t\t<div class=\"compassThird two\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"compassQuarter three\" [style.background-color]=\"facingColor\">\n\t\t\t\t\t<div class=\"compassSixty three\">\n\t\t\t\t\t\t<div class=\"compassThird three\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"compassQuarter four\" [style.background-color]=\"facingColor\">\n\t\t\t\t\t<div class=\"compassSixty four\">\n\t\t\t\t\t\t<div class=\"compassThird four\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"north\">N</p>\n\t\t\t\t\t<div id=\"toDraw\">\n\t\t\t\t\t\t<div id=\"ping\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div *ngIf=\"targetOnline\">\n\t\t\t\t<button *ngIf=\"!takingAim && !attacking\" class=\"button bottom\" (click)=\"takeAim()\">Take Aim</button>\n\t\t\t\t<button *ngIf=\"takingAim && !attacking\"\n\t\t\t\t\t[class]=\"buttonClass\" (click)=\"attack()\">\n\t\t\t\t\t{{attackMessage}}Attack\n\t\t\t\t</button>\n\t\t\t</div>\n\n\t\t\t<div *ngIf=\"!attacking\">\n\t\t\t\t<h3 [style.color]=\"resolution()\">Accuracy: {{myAcc}} meters</h3>\n\t\t\t</div>\n\n\t\t</div>\n\t",
            styles: ["\n\t\t.reload {\n\t\t\ttext-align: center;\n\t\t\tfont-size: 7em;\n\t\t\tfont-family: sans-serif;\n\t\t\tmargin-top: 20px;\n\t\t}\n\t\t#ping {\n\t\t\tposition: absolute;\n\t\t\theight: 6px;\n\t\t\twidth: 6px;\n\t\t\tborder-radius: 3px;\n\t\t\tborder: 1px solid rgb(64, 244, 255);\n\t\t\tbox-sizing: border-box;\n\t\t\topacity: 1;\n\t\t}\n\t\t.compassWrapper {\n\t\t\twidth: 80%;\n\t\t\tmargin: auto;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 80%;\n\t\t\tposition: relative;\n\t\t\ttransform: rotate(-90deg);\n\t\t}\n\t\t.compassQuarter {\n\t\t\tfloat: left;\n\t\t\tposition: relative;\n\t\t\twidth: 50%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 50%;\n\t\t\tbox-sizing: border-box;\n\t\t\tborder: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.compassThird {\n\t\t\twidth: 50%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 50%;\n\t\t\tposition: absolute;\n\t\t}\n\t\t.compassSixty {\n\t\t\twidth: 66%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 66%;\n\t\t\tposition: absolute;\n\t\t}\n\t\t.north {\n\t\t\ttransform: rotate(90deg);\n\t\t\ttop: -1.5em;\n\t\t\tleft: 101%;\n\t\t\tposition: absolute;\n\t\t}\n\t\t.one {\n\n\t\t\tborder-radius: 100% 0 0 0;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\tbox-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t}\n\t\t.one .compassSixty {\n\t\t\ttop: 33.4%;\n\t\t\tleft: 33.2%;\n\t\t\tborder-top: 1px solid rgb(64, 244, 255);\n\t\t\tborder-left: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.one .compassThird {\n\t\t\ttop: 50%;\n\t\t\tleft: 50%;\n\t\t\tborder-top: 1px solid rgb(64, 244, 255);\n\t\t\tborder-left: 1px solid rgb(64, 244, 255);\n\t\t}\n\n\t\t.two {\n\t\t\tborder-radius: 0 100% 0 0;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\tbox-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t}\n\t\t.two .compassSixty {\n\t\t\ttop: 33.4%;\n\t\t\tborder-top: 1px solid rgb(64, 244, 255);\n\t\t\tborder-right: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.two .compassThird {\n\t\t\ttop: 50%;\n\t\t\tborder-top: 1px solid rgb(64, 244, 255);\n\t\t\tborder-right: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.three {\n\t\t\tborder-radius: 0 0 0 100%;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\tbox-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t}\n\t\t.three .compassSixty {\n\t\t\tleft: 33.2%;\n\t\t\tborder-bottom: 1px solid rgb(64, 244, 255);\n\t\t\tborder-left: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.three .compassThird {\n\t\t\tleft: 50%;\n\t\t\tborder-bottom: 1px solid rgb(64, 244, 255);\n\t\t\tborder-left: 1px solid rgb(64, 244, 255);\n\t\t}\n\t\t.four {\n\t\t\tborder-radius: 0 0 100% 0;\n\t\t\tborder-bottom: 1px solid rgb(64, 244, 255);\n\t\t\tborder-right: 1px solid rgb(64, 244, 255);\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\tbox-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t}\n\t\t#toDraw {\n\t\t\tbackground-color: rgb(255, 248, 54);\n\t\t\tposition: absolute;\n\t\t\theight: 6px;\n\t\t\twidth: 6px;\n\t\t\tborder-radius: 3px;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t\tbox-shadow: 0px 0px 7px rgb(64, 244, 255);\n\t\t}\n\n\t"]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, api_service_1.ApiService, geo_service_1.GeoService])
    ], InGameComponent);
    return InGameComponent;
}());
exports.InGameComponent = InGameComponent;
//# sourceMappingURL=in-game.component.js.map