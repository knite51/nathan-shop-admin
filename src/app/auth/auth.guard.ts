import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad,
  Route
} from "@angular/router";
import { AuthService } from "./auth.service";
import { GeneralService } from "../services/general.service";
import { LocalStorageService } from "../utils/localStorage.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private genServ: GeneralService,
    private localStorage: LocalStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    this.genServ.expiredTokenUrl.next(url);
    return this.checkPermissionRole();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.login()) {
      return true;
    }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(["/login"]);
    return false;
  }

  checkPermissionRole() {
    const adminRole = JSON.parse(
      this.localStorage.getFromLocalStorage("ShopAdminUserInfo")
    ).role;
    if (adminRole === "shop_admin" || adminRole === "admin") {
      return true;
    } else {
      this.genServ.sweetAlertAuthVerification("You are not authorized");
      return false;
    }
  }
}
