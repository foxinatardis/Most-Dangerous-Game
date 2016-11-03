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
// All services are decorated with the @Injectable decorator
var core_1 = require("@angular/core");
// Import the HTTP libraries from the angular http folder
var http_1 = require("@angular/http");
// Import async functionality from the rxjs ("reactive js") library, which
// angular 2 uses to manage async requests.
var Observable_1 = require("rxjs/Observable");
require("rxjs/Rx");
require("rxjs/add/observable/throw");
// Decorate our ApiService as Injectable (service)
var ApiService = (function () {
    // An empty constructor, but we inject the Http provider into our class here
    function ApiService(http) {
        this.http = http;
        // We have different headers for post and get. For post, we are sending
        // content and need a "content-type" header
        this.postHeaders = new http_1.Headers({
            "Content-Type": "application/json",
            "Accept": "application/json"
        });
        // GET requests do not send any content, and just accept the JSON returned
        this.getHeaders = new http_1.Headers({
            "Accept": "application/json"
        });
        // This is the url of our server. We'll need to update this if our server
        // moves
        this.url = "http://localhost:8000";
    }
    // A helper function which returns an object version of the response JSON
    ApiService.prototype.getJSON = function (response) {
        return response.json();
    };
    // A helper function which checks if our response was actually an error,
    // and throws an error in that case. We could leverage this function to
    // show a nice error message to the user instead.
    ApiService.prototype.checkForError = function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        else {
            var error = new Error(response.statusText);
            error['response'] = response;
            throw error;
        }
    };
    // Perform a GET request to the server on path `path`.
    // IMPORTANT: This function actually returns an Observable object. This
    // Observable doesn't do anything until we subscribe to it, at which point
    // it performs the action and calls any attached callback functions.
    ApiService.prototype.getObs = function (path) {
        return this.http.get(this.url + path, { headers: this.getHeaders })
            .map(this.checkForError)
            .catch(function (err) { return Observable_1.Observable.throw(err); })
            .map(this.getJSON);
    };
    // See get() for details - this is the same, but performs a POST with a body
    ApiService.prototype.postObs = function (path, data) {
        return this.http.post(this.url + path, data, { headers: this.getHeaders })
            .map(this.checkForError)
            .catch(function (err) { return Observable_1.Observable.throw(err); })
            .map(this.getJSON);
    };
    ApiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map