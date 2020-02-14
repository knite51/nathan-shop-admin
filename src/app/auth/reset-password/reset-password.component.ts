import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  credentials = {
    password: "",
    password_confirmation: ""
  };
  token = "";
  constructor(
    private endpoints: EndpointsService,
    private router: Router,
    private genServ: GeneralService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(res => {
      const { token } = res;
      this.token = token;
    });
  }

  ngOnInit() {}

  private get resetCredentials(): any {
    let validationFields = "";
    const obj = this.credentials;
    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    if (obj.password !== obj.password_confirmation) {
      validationFields += `Password must match confirmation`;
    }
    return !validationFields ? { ...obj } : validationFields;
  }

  handleNewpassword() {
    const credentials = this.resetCredentials;
    if (typeof credentials === "string") {
      this.genServ.sweetAlertHTML("Validation", credentials);
    } else {
      const apiUrl = `${this.endpoints.registerLoginUrl.changePassword}/${this.token}`;
      this.endpoints.updateWithPatch(apiUrl, credentials).subscribe(
        (res: any) => {
          const { message } = res;
          if (message) {
            this.genServ.sweetAlertHTMLNotify(message);
            // reset all other api calls headers
            this.endpoints.httpStatus = "allCalls";
            // Navigate to View
            this.backToPreviousPage();
          }
        },
        error => {
          console.log(error, "lol");
          this.genServ.sweetAlertAuthVerification("Invalid Credentials.");
        }
      );
    }
  }

  handlePassReset() {}

  backToPreviousPage() {
    this.router.navigate(["/login"]);
  }
}
