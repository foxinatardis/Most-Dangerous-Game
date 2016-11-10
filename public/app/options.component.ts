import { Component } from "@angular/core";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<div *ngIf="!selectionMade && !result">
			<div class="button" (click)="changePassword()" *ngIf="!selectionMade">
				<p class="inside-button">Change Password</p>
			</div>
			<div class="button"></div>
			<div class="button"></div>
			<div class="button"></div>
		</div>
		<div *ngIf="selectionMade && !result">
			<div *ngIf="displayChangePassword">
				<input type="password" [(ngModel)]="oldPassword" placeholder="Old Password">
				<input type="password" [(ngModel)]="newPassword" placeholder="New Password">
				<input type="password" [(ngModel)]="confirmPassword" placeholder="Confirm New Password">
				<h3 class="error" *ngIf="!passwordVerify()">Passwords must match and contain at least 8 characters</h3>
				<div class="button" (click)="sendPassword()">
					<p class="inside-button">Change Password</p>
				</div>
			</div>
		</div>
		<div *ngIf="result">
			<h3>{{resultMessage}}</h3>
			<div class="button" (click)="displayOptions()">Back to Options</div>
		</div>
	`,
})
export class OptionsComponent {
	constructor(
		private apiService: ApiService,
		private authService: AuthService,
		private router: Router
	) { }
	// display variables and functions
	private selectionMade: boolean = false;
	private result: boolean = false;
	private resultMessage: string = "";
	private displayChangePassword: boolean = false;
	private displayOptions() {
		this.result = false;
		this.resultMessage = "";
		this.displayChangePassword = false;
	}
	private changePassword() {
		this.selectionMade = true;
		this.displayChangePassword = true;
	}


	// change password variables and functions
	private oldPassword: string = "";
	private newPassword: string = "";
	private confirmPassword: string = "";
	private passwordVerify() {
		if (this.newPassword === this.confirmPassword && this.newPassword.length >= 8) {
			return true;
		} return false;
	}
	private sendPassword() {
		if (this.passwordVerify()) {
			let toSend = {
				oldPassword: this.oldPassword,
				newPassword: this.newPassword
			};
			this.apiService.postObs("/api/change-password", toSend).subscribe((res) => {
				this.result = true;
				this.resultMessage = res.message;
			});
		}
	};
}
