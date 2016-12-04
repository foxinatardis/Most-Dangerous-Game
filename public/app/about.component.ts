import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
	template: `
		<h2 class="about">About The MDG</h2>
		<div class="button" id="aboutButton" *ngIf="!this.authService.user">
			<p class="about-button" (click)="toLogin()">Login/Register</p>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayJoin = !displayJoin">Joining a Game</p>
		</div>
		<div [hidden]="displayJoin">
			<h3 class="about">Joining a Game</h3>
			<ol>
				<li>Navigate to the Join/Create Game page.</li>
				<li>Enter the username of the game creator into the input field.</li>
				<li>Press the "Join Game" button.</li>
				<li>You are now a part of the game and can navigate to the Waiting Room to see who else is in the game.</li>
				<li>Remember, you can only be part of one game at a time.</li>
			</ol>
			<div [hidden]="!this.authService.user || this.authService.user.currentGame">
				<p class="about">You can press the button below to navigate to the Join/Create Game page.</p>
				<div class="button">
					<p class="inside-button" (click)="toJoin()">Join a Game</p>
				</div>
			</div>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayCreate = !displayCreate">Creating a Game</p>
		</div>
		<div [hidden]="displayCreate">
			<h3 class="about">Creating a Game</h3>
			<ol>
				<li>Navigate to the Join/Create Game page.</li>
				<li>Press the "Create Game" button.</li>
				<li>You have now created a game.</li>
				<li>Invite your friends to join your game, all they need is a profile and your username.</li>
				<li>Now you can navigate to the Waiting Room where you can see who else has joined, and launch the game when ready.</li>
				<li>Remember, you can only be part of one game at a time.</li>
			</ol>
			<div [hidden]="!this.authService.user || this.authService.user.currentGame">
				<p class="about">You can press the button below to navigate to the Join/Create Game page.</p>
				<div class="button">
					<p class="inside-button" (click)="toJoin()">Create a Game</p>
				</div>
			</div>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayWaiting = !displayWaiting">The Waiting Room</p>
		</div>
		<div [hidden]="displayWaiting">
			<h3 class="about">Inside the Waiting Room</h3>
			<ul>
				<li>This is where you can see who else is in the game you have joined or created.</li>
				<li>If you are the game admin, this is the screen you will launch the game from.</li>
				<li>It is recommended that you visit the Waiting Room after joining a game.</li>
				<li>You do NOT need to be in the waiting room when the game is launched in order to play.</li>
				<li>When the game admin launches the game you will automatically be redirected to the active gameplay screen.</li>
				<li>We are working on a waiting room chat feature which will be included in future updates.</li>
			</ul>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayPlaying = !displayPlaying">Playing The Game</p>
		</div>
		<div [hidden]="displayPlaying">
			<h3 class="about">Inside the Game</h3>
			<ul>
				<li>The name of your target is displayed in the upper left corner below your current score.</li>
				<li>If your target is currently online, below their name it will display "Target Aquired" and their distance from you.</li>
				<li>If they are not online it will indicate how far from your location they were last seen.</li>
				<li>You are visible to whoever is tracking you whenever you are tracking your target.</li>
				<li>Use the compass and distance provided to find your target in the real world.</li>
				<li>Pressing the "Take Aim" button will trigger 15 seconds of increased accuracy.</li>
				<li>Once within 100 meters of your target you can attempt an attack.</li>
				<li>The closer you are to your target the better the chance of success.</li>
				<li>Indoors your GPS signal may be inadequate to verify a kill shot, it is recommended that you attack your target while outside.</li>
				<li>Current GPS accuracy is displayed below the compass display.</li>
			</ul>
			<div [hidden]="!this.authService.user || !this.authService.user.inGame">
				<p class="about">You can press the button below to enter your current game.</p>
				<div class="button">
					<p class="inside-button" (click)="toGame()">Enter Game</p>
				</div>
			</div>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayEnd = !displayEnd">The End Game</p>
		</div>
		<div [hidden]="displayEnd">
			<h3 class="about">Ending a Game</h3>
			<ul>
				<li>Upon a successful kill, you will be assigned a new target.</li>
				<li>Once there is only one player left alive the game ends.</li>
				<li>Check the Game History from your Profile Page to see the game results.</li>
			</ul>
			<div [hidden]="!this.authService.user">
				<p class="about">You can press the button below see your game history.</p>
				<div class="button">
					<p class="inside-button" (click)="toHistory()">Game History</p>
				</div>
			</div>
		</div>

		<div class="button">
			<p class="inside-button" (click)="displayFeedback = !displayFeedback">Feedback</p>
		</div>
		<div [hidden]="displayFeedback">
			<h3 class="about">Send some Feedback</h3>
			<p class="about">We are always working to improve "The Most Dangerous Game"</p>
			<p class="about">This is currenlty an alpha-test version.
			If you have a suggestion on how we can make the game better, please press the button below to contact us by email.</p>
			<div class="button">
				<a href="mailto:foxinatardis@gmail.com?Subject=TheMDG%20Feedback">
					<p class="inside-button">Send Feedback</p>
				</a>
			</div>
		</div>
	`,
	styles: [`
		#aboutButton {
			height: 30px;
		}
		p.about-button {
			color: black;
			text-align: center;
			vertical-align: middle;
			line-height: 30px;
			font-size: 20px;
			font-family: sans-serif;
		}
		li {
			margin-top: 10px;
			margin-right: 25px;
			text-align: justify;
		}
		h2.about {
			text-align: center;
		}
		h3.about {
			margin-left: 20px;
		}
		p.about {
			margin-right: 25px;
			margin-left: 25px;
			text-align: justify;
		}
		a {
			color: #111;
			text-decoration: none;
		}
	`]
})
export class AboutComponent {
	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	// display booleans
	displayJoin: boolean = true;
	displayCreate: boolean = true;
	displayWaiting: boolean = true;
	displayPlaying: boolean = true;
	displayEnd: boolean = true;
	displayFeedback: boolean = true;

	toLogin() {
		this.router.navigate(["/login"]);
	}
	toJoin() {
		this.router.navigate(["/game-selection"]);
	}
	toGame() {
		this.router.navigate(["/in-game"]);
	}
	toHistory() {
		this.router.navigate(["/game-history"]);
	}
}
