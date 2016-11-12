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
        this.targetOnline = false;
        this.gameId = this.authService.user.currentGame;
    }
    InGameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.compass = document.getElementById("compassWrapper");
        this.compassWatch = Compass.watch(function (heading) {
            console.log(heading);
            this.compass.style.transform = "rotate(" + ((90 + heading) * -1) + "deg)";
        }.bind(this));
        Compass.noSupport(function () {
            this.compass.style.transform = "rotate(-90deg)";
        }.bind(this));
        this.geoService.getLocation(this.positionSuccess.bind(this), this.positionErr.bind(this));
        this.locationWatch = navigator.geolocation.watchPosition(this.iMovedSuccess.bind(this));
        this.locationInterval = setInterval(this.sendLocation.bind(this), 15000);
        this.socket = io();
        this.socket.on("target online", function (data) {
            console.log("target online: ", data);
            if (data) {
                _this.targetOnline = true;
                if (data.targetLat) {
                    _this.targetLat = data.targetLat;
                    _this.targetLong = data.targetLong;
                    _this.targetAcc = data.targetAcc;
                    _this.targetTime = data.targetTime;
                    _this.update();
                }
            }
            else {
                _this.targetOnline = false;
            }
        });
        this.socket.on("score", function (data) {
            _this.authService.user.score = data;
        });
        this.socket.on("being watched", function (data) {
            _this.rapidEmit(data);
            console.log("you are being watched: ", data);
        });
        this.socket.on("attack result", function (data) {
            if (data) {
                _this.attackMessage = "Target taken out. Awaiting info on next target...";
                _this.nextTarget();
            }
            else {
                _this.attackMessage = "Target missed... ";
                setTimeout(function () {
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
    InGameComponent.prototype.ngOnDestroy = function () {
        Compass.unwatch(this.compassWatch);
        this.socket.disconnect();
        clearInterval(this.locationInterval);
        navigator.geolocation.clearWatch(this.locationWatch);
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
    // functions for practical uses
    InGameComponent.prototype.takeAim = function () {
        var data = {
            targetName: this.targetName,
            trackerName: this.authService.user.name
        };
        this.takingAim = true;
        this.socket.emit("take aim", data);
        console.log("take aim data: ", data);
        setInterval(function () {
            if (this.takingAim) {
                this.takingAim = false;
                this.attacking = false;
                this.attackMessage = "";
            }
        }.bind(this), 20000);
    };
    InGameComponent.prototype.attack = function () {
        this.attacking = true;
        this.takingAim = false;
        this.attackMessage = "Confirming kill...";
        var data = {
            distance: this.distanceToTarget,
            accuracy: this.accuracy,
            targetName: this.targetName,
            gameId: this.authService.user.currentGame
        };
        this.socket.emit("attack", data);
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
            this.socket.emit("give aim", data); // todo finish function for handling someone taking aim at you
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
                    score: _this.authService.user.score
                };
                _this.socket.emit("join", joinData);
                _this.compass = document.getElementById("compassWrapper");
            }
        });
    };
    InGameComponent.prototype.positionErr = function (err) {
        console.log(err);
        this.error = true;
        this.errorMessage = "Sorry, something went wrong. Please reload and try again.";
    };
    InGameComponent.prototype.iMovedSuccess = function (pos) {
        var coor = pos.coords;
        this.myLong = coor.longitude;
        this.myLat = coor.latitude;
        this.myTime = pos.timestamp;
        this.myAcc = coor.accuracy;
        if (coor.heading) {
            this.myHeading = coor.heading;
        }
        console.log("locationWatch: ", pos);
        this.update();
    };
    InGameComponent.prototype.update = function () {
        if (this.myLat && this.targetLat) {
            this.distanceToTarget = Math.floor(this.getDistance(this.myLong, this.myLat, this.targetLong, this.targetLat));
            this.accuracy = Math.floor(this.myAcc + this.targetAcc);
            this.bearing = Math.floor(this.getBearing(this.myLong, this.myLat, this.targetLong, this.targetLat));
            // console.log("requirements met");
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
            template: "\n\t\t<div>\n\t\t\t<h2>Score: {{this.authService.user.score}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error\">\n\t\t\t<h2 [style.color]=\"online()\">Target: {{targetName}}</h2>\n\t\t\t<p *ngIf=\"targetOnline\">Target Aquired: {{distanceToTarget}} meters from you location.</p>\n\t\t\t<p *ngIf=\"!targetOnline\">Target Last seen {{distanceToTarget}} meters from your location.</p>\n\t\t</div>\n\t\t<div *ngIf=\"error\">\n\t\t\t<h2 class=\"error\">{{errorMessage}}</h2>\n\t\t</div>\n\n\t\t<div class=\"compassWrapper\" id=\"compassWrapper\" *ngIf=\"!error\">\n\t\t\t<div class=\"compassQuarter one\">\n\t\t\t\t<div class=\"compassSixty one\">\n\t\t\t\t\t<div class=\"compassThird one\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"compassQuarter two\">\n\t\t\t\t<div class=\"compassSixty two\">\n\t\t\t\t\t<div class=\"compassThird two\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"compassQuarter three\">\n\t\t\t\t<div class=\"compassSixty three\">\n\t\t\t\t\t<div class=\"compassThird three\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"compassQuarter four\">\n\t\t\t\t<div class=\"compassSixty four\">\n\t\t\t\t\t<div class=\"compassThird four\"></div>\n\t\t\t\t</div>\n\t\t\t\t<p class=\"north\">N</p>\n\t\t\t\t<div id=\"toDraw\"></div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<button *ngIf=\"!takingAim && !attacking && !error\" class=\"button bottom\" (click)=\"takeAim()\">Take Aim</button>\n\t\t<button *ngIf=\"takingAim && !attacking && !error\" class=\"button bottom\" (click)=\"attack()\">Attack</button>\n\t\t<div *ngIf=\"attacking\">\n\t\t\t<h2>{{attackMessage}}</h2>\n\t\t</div>\n\t\t<div *ngIf=\"!error && !attacking\">\n\t\t\t<h3 [style.color]=\"resolution()\">Accuracy: {{accuracy}} meters</h3>\n\t\t</div>\n\t",
            styles: ["\n\t\t.compassWrapper {\n\t\t\twidth: 80%;\n\t\t\tmargin: auto;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 80%;\n\t\t\tposition: relative;\n\t\t}\n\t\t.compassQuarter {\n\t\t\tfloat: left;\n\t\t\tposition: relative;\n\t\t\twidth: 50%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 50%;\n\t\t\tbox-sizing: border-box;\n\t\t\tborder: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.compassThird {\n\n\t\t\twidth: 50%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 50%;\n\t\t\tposition: absolute;\n\n\t\t}\n\t\t.compassSixty {\n\n\t\t\twidth: 66%;\n\t\t\theight: 0;\n\t\t\tpadding-bottom: 66%;\n\t\t\tposition: absolute;\n\n\t\t}\n\t\t.north {\n\t\t\ttransform: rotate(90deg);\n\t\t\ttop: -1.5em;\n\t\t\tleft: 101%;\n\t\t\tposition: absolute;\n\t\t}\n\t\t.one {\n\n\t\t\tborder-radius: 100% 0 0 0;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 7px rgb(73, 125, 232);\n\n\t\t}\n\t\t.one .compassSixty {\n\t\t\ttop: 33.4%;\n\t\t\tleft: 33.2%;\n\t\t\tborder-top: 1px solid rgb(73, 125, 232);\n\t\t\tborder-left: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.one .compassThird {\n\t\t\ttop: 50%;\n\t\t\tleft: 50%;\n\t\t\tborder-top: 1px solid rgb(73, 125, 232);\n\t\t\tborder-left: 1px solid rgb(73, 125, 232);\n\t\t}\n\n\t\t.two {\n\n\t\t\tborder-radius: 0 100% 0 0;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 7px rgb(73, 125, 232);\n\n\t\t}\n\t\t.two .compassSixty {\n\t\t\ttop: 33.4%;\n\t\t\tborder-top: 1px solid rgb(73, 125, 232);\n\t\t\tborder-right: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.two .compassThird {\n\t\t\ttop: 50%;\n\t\t\tborder-top: 1px solid rgb(73, 125, 232);\n\t\t\tborder-right: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.three {\n\n\t\t\tborder-radius: 0 0 0 100%;\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 7px rgb(73, 125, 232);\n\n\t\t}\n\t\t.three .compassSixty {\n\t\t\tleft: 33.2%;\n\t\t\tborder-bottom: 1px solid rgb(73, 125, 232);\n\t\t\tborder-left: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.three .compassThird {\n\t\t\tleft: 50%;\n\t\t\tborder-bottom: 1px solid rgb(73, 125, 232);\n\t\t\tborder-left: 1px solid rgb(73, 125, 232);\n\t\t}\n\t\t.four {\n\n\t\t\tborder-radius: 0 0 100% 0;\n\t\t\tborder-bottom: 1px solid rgb(73, 125, 232);\n\t\t\tborder-right: 1px solid rgb(73, 125, 232);\n\t\t\t-moz-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 7px rgb(73, 125, 232);\n\t\t}\n\t\t#toDraw {\n\t\t\tbackground-color: rgb(68, 120, 227);\n\t\t\tposition: absolute;\n\t\t\theight: 6px;\n\t\t\twidth: 6px;\n\t\t\tborder-radius: 3px;\n\t\t\t-moz-box-shadow: 0px 0px 5px rgb(73, 125, 232);\n\t\t\t-webkit-box-shadow: 0px 0px 5px rgb(73, 125, 232);\n\t\t\tbox-shadow: 0px 0px 5px rgb(73, 125, 232);\n\t\t}\n\n\t"]
        }), 
        __metadata('design:paramtypes', [auth_service_1.AuthService, api_service_1.ApiService, geo_service_1.GeoService])
    ], InGameComponent);
    return InGameComponent;
}());
exports.InGameComponent = InGameComponent;
(function (e) {
    "use strict";
    var t = function (t) { return t != null || t != e; }, n = function (e, t) { var n = i._callbacks[e]; for (var r = 0; r < n.length; r++)
        n[r].apply(window, t); }, r = function (e) { var t = 0; for (var n = e.length - 1; n > e.length - 6; n--)
        t += e[n]; return t / 5; }, i = window.Compass = { method: e, watch: function (e) { var t = ++i._lastId; return i.init(function (n) { if (n == "phonegap")
            i._watchers[t] = i._nav.compass.watchHeading(e);
        else if (n == "webkitOrientation") {
            var r = function (t) { e(t.webkitCompassHeading); };
            i._win.addEventListener("deviceorientation", r), i._watchers[t] = r;
        }
        else if (n == "orientationAndGPS") {
            var s, r = function (t) { s = -t.alpha + i._gpsDiff, s < 0 ? s += 360 : s > 360 && (s -= 360), e(s); };
            i._win.addEventListener("deviceorientation", r), i._watchers[t] = r;
        } }), t; }, unwatch: function (e) { return i.init(function (t) { t == "phonegap" ? i._nav.compass.clearWatch(i._watchers[e]) : (t == "webkitOrientation" || t == "orientationAndGPS") && i._win.removeEventListener("deviceorientation", i._watchers[e]), delete i._watchers[e]; }), i; }, needGPS: function (e) { return i._callbacks.needGPS.push(e), i; }, needMove: function (e) { return i._callbacks.needMove.push(e), i; }, noSupport: function (e) { return i.method === !1 ? e() : t(i.method) || i._callbacks.noSupport.push(e), i; }, init: function (e) { if (t(i.method)) {
            e(i.method);
            return;
        } i._callbacks.init.push(e); if (i._initing)
            return; return i._initing = !0, i._nav.compass ? i._start("phonegap") : i._win.DeviceOrientationEvent ? (i._checking = 0, i._win.addEventListener("deviceorientation", i._checkEvent), setTimeout(function () { i._checking !== !1 && i._start(!1); }, 500)) : i._start(!1), i; }, _lastId: 0, _watchers: {}, _win: window, _nav: navigator, _callbacks: { init: [], noSupport: [], needGPS: [], needMove: [] }, _initing: !1, _gpsDiff: e, _start: function (e) { i.method = e, i._initing = !1, n("init", [e]), i._callbacks.init = [], e === !1 && n("noSupport", []), i._callbacks.noSupport = []; }, _checking: !1, _checkEvent: function (e) { i._checking += 1; var n = !1; t(e.webkitCompassHeading) ? i._start("webkitOrientation") : t(e.alpha) && i._nav.geolocation ? i._gpsHack() : i._checking > 1 ? i._start(!1) : n = !0, n || (i._checking = !1, i._win.removeEventListener("deviceorientation", i._checkEvent)); }, _gpsHack: function () { var e = !0, s = [], o = []; n("needGPS"); var u = function (e) { s.push(e.alpha); }; i._win.addEventListener("deviceorientation", u); var a = function (a) { var f = a.coords; if (!t(f.heading))
            return; e && (e = !1, n("needMove")), f.speed > 1 ? (o.push(f.heading), o.length >= 5 && s.length >= 5 && (i._win.removeEventListener("deviceorientation", u), i._nav.geolocation.clearWatch(l), i._gpsDiff = r(o) + r(s), i._start("orientationAndGPS"))) : o = []; }, f = function () { i._win.removeEventListener("deviceorientation", u), i._start(!1); }, l = i._nav.geolocation.watchPosition(a, f, { enableHighAccuracy: !0 }); } };
})();
//# sourceMappingURL=in-game.component.js.map