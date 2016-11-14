import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable()
export class AuthService implements CanActivate {
	constructor(private router: Router) { }

	public user = undefined;

	public canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		if (this.user === undefined) {
			this.router.navigate(["login"]);
			return false;
		}
		return true;
	}

}
