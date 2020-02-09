import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "src/app/utils/localStorage.service";
import { GeneralService } from "src/app/services/general.service";
import { AuthService } from "../auth.service";
import { Route } from "@angular/compiler/src/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  credentials = {
    email: "",
    password: ""
  };
  constructor(
    private endpoints: EndpointsService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService,
    private genServ: GeneralService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  private get loginCredentials() {
    let validationFields = "";
    const obj = this.credentials;

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...this.credentials } : validationFields;
  }

  handleLogin() {
    const credentials = this.loginCredentials;
    if (typeof credentials === "string") {
      this.genServ.sweetAlertHTML("Validation", credentials);
    } else {
      const apiUrl = this.endpoints.registerLoginUrl.loginShopAdmin;

      this.endpoints.loginUser(apiUrl, credentials).subscribe(
        (res: any) => {
          console.log(res, "respinse");
          const {
            access_token,
            user: { email, first_name, last_name }
          } = res;
          this.localStorage.saveToLocalStorage("token", access_token);
          this.localStorage.saveToLocalStorage("ShopAdminUserInfo", {
            email,
            first_name,
            last_name
          });
          // reset all other api calls headers
          this.endpoints.httpStatus = "allCalls";
          // Navigate to View
          this.backToPreviousPage();
        },
        error => {
          console.log(error, "lol");
          this.genServ.sweetAlertAuthVerification("Invalid Credentials.");
        }
      );
    }
  }

  backToPreviousPage() {
    const url = this.route.snapshot.queryParams.redirectTo;
    if (url) {
      this.router.navigate([`${url}`]);
    } else {
      this.router.navigate(["/adminDashboard"]);
    }
  }
}
