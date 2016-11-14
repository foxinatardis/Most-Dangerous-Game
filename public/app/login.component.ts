import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";

@Component({

	template: `
		<div>
			<h2 *ngIf="register">Username: <span class="error" *ngIf="error">{{error}}</span></h2>
			<input type="text" [(ngModel)]="loginUser.username" placeholder="Username" *ngIf="register">
			<h3 class="error" *ngIf="error">{{error}}</h3>
			<h2>Email: </h2>
			<input type="text" [(ngModel)]="loginUser.email" placeholder="Email">

			<h2>Password: </h2>
			<input type="password" [(ngModel)]="loginUser.password" placeholder="Password">

			<h2 *ngIf="register">Re-enter Password: </h2>
			<input type="password" [(ngModel)]="password" placeholder="Password" *ngIf="register">
			<h3 class="error" *ngIf="register && !passwordVerify()">{{registerError}}</h3>

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
		</div>
		<div class="button" (click)="about()">
			<p class="inside-button">About</p>
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
	test: string = "";
	private loginUser = {
		username: "",
		email: "",
		password: ""
	};
	password: string = "";
	registerError: string = "Passwords must match and be atleast 8 characters";

	private error: string = "";

	private newUser() {
		this.register = !this.register;
	};

	private sendRegistration() {
		if (this.passwordVerify()) {
			this.apiService.postObs("/api/signup", this.loginUser).subscribe((res) => {
				if (res.error) {
					this.error = res.message;
				} else if (res.user) {
					this.authService.user = res.user;
					this.router.navigate(["/"]);
				}
			});
		}
	};

	private passwordVerify() {
		if (this.password === this.loginUser.password && this.password.length >= 8) {
			return true;
		} return false;
	}

	private sendLogin() {
		this.apiService.postObs("/api/login", this.loginUser).subscribe((res) => {
			if (res.loggedIn) {
				this.authService.user = res.userData[0];
				this.router.navigate(["/profile"]);
			} else if (res.error) {
				this.error = res.message;
			}
		});
	}

	private about() {
		this.router.navigate(["/about"]);
	}
}
