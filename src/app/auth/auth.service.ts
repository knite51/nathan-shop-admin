import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "../utils/localStorage.service";
import { EndpointsService } from "../services/config/endpoints.service";
import { GeneralService } from "../services/general.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  isLoggedIn = false;
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private localstorage: LocalStorageService,
    private router: Router,
    private endpoints: EndpointsService,
    private genServ: GeneralService
  ) {}

  private validateToken() {
    const apiUrl = this.endpoints.validateTokenUrl.tokenVerify;
    return new Promise(resolve => {
      this.endpoints.fetch(apiUrl).subscribe(
        res => {
          resolve(true);
        },
        error => {
          console.log("Error Validating");
          resolve(false);
        }
      );
    });
  }

  login() {
    // const status = await this.validateToken();
    const status = true;
    status ? (this.isLoggedIn = true) : (this.isLoggedIn = false);
    // console.log(status, "1019");
    if (!status) {
      this.logout();
    }
    return status;
  }

  logout(errType?): void {
    errType === "unauthenticated"
      ? this.genServ.sweetAlertAuthVerification(
          "Token has expired. Kindly Login"
        )
      : null;
    this.localstorage.deleteFromLocalStorage("token");
    this.localstorage.deleteFromLocalStorage("ShopAdminUserInfo");
    this.router.navigate(["/login"]);
    // if (redirectUrl) {
    //   this.router.navigate(["/login"], {
    //     queryParams: { redirectTo: redirectUrl }
    //   });
    // } else {
    // }
  }
}
