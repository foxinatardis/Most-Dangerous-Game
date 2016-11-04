import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";

@Component({

	template: `
		<div>
			<h2 *ngIf="register">Username: </h2>
			<input type="text" [(ngModel)]="loginUser.username" placeholder="Username" *ngIf="register">

			<h2>Email: </h2>
			<input type="text" [(ngModel)]="loginUser.email" placeholder="Email">

			<h2>Password: </h2>
			<input type="password" [(ngModel)]="loginUser.password" placeholder="Password">

			<div>
				<div class="button" (click)="sendLogin()" *ngIf="!register">
					<p class="inside-button">Login</p>
				</div>

				<div class="button" (click)="sendRegistration()" *ngIf="register">
					<p class="inside-button">Register</p>
				</div>

				<div class="button" (click)="newUser()" *ngIf="register">
					<p class="inside-button">Login</p>
				</div>

				<div class="button" (click)="newUser()" *ngIf="!register">
					<p class="inside-button">Create New User</p>
				</div>
			</div>
			<p *ngIf="error">{{error}}</p>
		</div>
	`,
	styles: [`
		div.button: {
			width: 49%;
			background-color: #505BFF;
			border: none;
			box-sizing: border-box;
			float: left;
		}
	`]
})
export class LoginComponent {
	constructor(
		private authService: AuthService,
		private router: Router,
		private apiService: ApiService
	) { }

	register: boolean = false;

	private loginUser = {
		username: "",
		email: "",
		password: ""
	};

	private error: string = "";

	private newUser() {
		this.register = !this.register;
	};

	private sendRegistration() {

		this.apiService.postObs("/api/signup", this.loginUser).subscribe((res) => {
			if (res.error) {
				// todo handle error
			} else {
				this.router.navigate(["/login"]);
			}

		});
	};

	private sendLogin() {
		this.apiService.postObs("/api/login", this.loginUser).subscribe((res) => {
			if (res.loggedIn) {
				this.authService.user = res.userData[0];
				if (this.authService.user.currentGame) {
					if (this.authService.user.inProgress) {
						this.router.navigate(["/"]); // todo add inProgress component
					} else {
						this.router.navigate(["/enter-game"]);
					}
				} else {
					this.router.navigate(["/game-selection"]);
				}

			}
		});

		// fake!!!
		// if (this.loginUser.username.length === 0) {
		// 	this.error = "Username cannot be empty";
		// } else {
		// 	this.authService.user = this.loginUser;
		// 	this.router.navigate(["/league"]);
		// }
	}
}
