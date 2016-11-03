// All services are decorated with the @Injectable decorator
import { Injectable } from "@angular/core";

// Import the HTTP libraries from the angular http folder
import { Http, Headers, Response } from "@angular/http";


// Import async functionality from the rxjs ("reactive js") library, which
// angular 2 uses to manage async requests.
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import "rxjs/add/observable/throw";

// Decorate our ApiService as Injectable (service)
@Injectable()
export class ApiService {
	// We have different headers for post and get. For post, we are sending
	// content and need a "content-type" header
	private postHeaders: Headers = new Headers({
		"Content-Type": "application/json",
		"Accept": "application/json"
	});

	// GET requests do not send any content, and just accept the JSON returned
	private getHeaders: Headers = new Headers({
		"Accept": "application/json"
	});

	// This is the url of our server. We'll need to update this if our server
	// moves
	private url: string = "http://localhost:8000";

	// An empty constructor, but we inject the Http provider into our class here
	constructor(private http: Http) { }

	// A helper function which returns an object version of the response JSON
	private getJSON(response: Response) {
		return response.json();
	}

	// A helper function which checks if our response was actually an error,
	// and throws an error in that case. We could leverage this function to
	// show a nice error message to the user instead.
	private checkForError(response: Response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else {
			let error = new Error(response.statusText);
			error['response'] = response;
			throw error;
		}
	}

	// Perform a GET request to the server on path `path`.
	// IMPORTANT: This function actually returns an Observable object. This
	// Observable doesn't do anything until we subscribe to it, at which point
	// it performs the action and calls any attached callback functions.
	getObs(path: string): Observable<any> {
		return this.http.get(
			this.url + path,
			{headers: this.getHeaders}
		)
		// check the observable response for errors
		.map(this.checkForError)
		// if there is an error, throw that error
		.catch((err) => Observable.throw(err))
		// otherwise, return an object representation of the returned JSON
		.map(this.getJSON);
	}

	// See get() for details - this is the same, but performs a POST with a body
	postObs(path: string, data: any): Observable<any> {
		return this.http.post(
			this.url + path,
			data,
			{headers: this.getHeaders}
		)
		.map(this.checkForError)
		.catch((err) => Observable.throw(err))
		.map(this.getJSON);
	}

}
