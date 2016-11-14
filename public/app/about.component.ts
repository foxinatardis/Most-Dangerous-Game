import { Component } from "@angular/core";
import { Router } from "@angular.router";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<div>
			<h2>Welcome to Most Dangerous Game</h2>
			<h3>How it works:</h3>
			<p>A User creates a new private game and tells their friends to join the game. You can join a game by entering the username of the game creator and hitting "Join Game".</p>
			<p>You will then be able to enter the waiting room which is where you can see the names of the other players who have joined while waiting for the game admin to launch the game.</p>
			<p>Once the game has been launched each player will be assigned a random target from the player list. While you are online tracking your target your location is visible to the player tracking you.</p>
			<p>The closer you are to your target the more likely your attempt to take them out is to succeed.</p>
			<p>After you have taken out your target your score will increase and you will take over the target that player was tracking.</p>
			<p>The game ends when there is only one player left.</p>
			<p>In future implementations you will be able to trade in points from your score for temporary bonuses such as invisible tracking or increased attack range.</p>
			<p>If you have any feedback on how to improve the game please feel free to email the creator at foxinatardis@gmail.com</p>

		<div>
		<div class="button" *ngIf="!this.authService.user">
			<p class="inside-button" (click)="toLogin()">Login/Register</p>
		</div>
	`,
})
export class AboutComponent {
	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	toLogin() {
		this.router.navigate(["/login"]);
	}
}
