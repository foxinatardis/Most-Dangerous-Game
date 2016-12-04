import { Component } from '@angular/core';
import { AuthService } from "./auth.service";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";

@Component({
	selector: 'assassin',
	template: `
		<nav *ngIf="this.authService.user">
			<div class="for-nav" (click)="this.router.navigate(['/profile'])">
				<p class="p-nav">Profile</p>
			</div>
			<div class="for-nav" (click)="logout()">
				<p class="p-nav">Logout</p>
			</div>
		</nav>
		<router-outlet></router-outlet>
	`,

})
export class AppComponent {
	constructor(
		private authService: AuthService,
		private apiService: ApiService,
		private router: Router
	) {}

	logout() {
		this.apiService.getObs("/logout").subscribe((res) => {
			if (res.success) {
				delete this.authService.user;
				this.router.navigate(["/login"]);
			}
		});

	}

}
