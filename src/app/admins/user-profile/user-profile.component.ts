import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  profileDetails: any = {};
  passwordDetails = {
    old_password: "",
    password: "",
    password_confirmation: ""
  };
  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private localStorage: LocalStorageService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.getProfile();
  }

  ngOnInit() {}

  private getProfile() {
    const apiUrl = `${this.endpoints.userProfileUrl.getUpdate}/`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      console.log(res, "resAdminUsers");
      this.profileDetails = res.user;
    });
  }

  private get passwordChangeValidation(): any {
    let validationFields = "";
    const obj = this.passwordDetails;
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

  private get updatedprofileDetails(): any {
    let validationFields = "";
    const obj = this.profileDetails;
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...this.profileDetails } : validationFields;
  }

  handleUpdate() {
    const updatedprofileDetails = this.updatedprofileDetails;
    if (typeof updatedprofileDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", updatedprofileDetails);
    } else {
      this.genServ.sweetAlertUpdates("Admin Users").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.userProfileUrl.getUpdate}/update`;
          this.endpoints
            .updateWithPatch(apiUrl, updatedprofileDetails)
            .subscribe(
              (res: any) => {
                console.log(res, "userInfo updated");
                const {
                  user: { email, first_name, last_name }
                } = res;
                this.localStorage.saveToLocalStorage("ShopAdminUserInfo", {
                  email,
                  first_name,
                  last_name
                });
                this.getProfile();
                this.genServ.sweetAlertSucess(
                  "Admin User Updated",
                  "Update Successful"
                );
              },
              error => {
                console.log(error, "error on update");
                this.genServ.sweetAlertError("Sorry, Update Not Successful");
              }
            );
        }
      });
    }
  }

  handlePasswordChange() {
    const newPasswordDetails = this.passwordChangeValidation;
    if (typeof newPasswordDetails === "string") {
      this.genServ.sweetAlertHTML("Password Validation", newPasswordDetails);
    } else {
      this.genServ.sweetAlertUpdates("Password").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.userProfileUrl.changePassword}`;
          this.endpoints.create(apiUrl, newPasswordDetails).subscribe(
            res => {
              console.log(res);
              this.passwordDetails = {
                old_password: "",
                password: "",
                password_confirmation: ""
              };
              this.genServ.sweetAlertSucess(
                "Password Changed",
                "Update Successful"
              );
            },
            error => {
              console.log(error, "error on update");
              this.genServ.sweetAlertError(
                "Update Not Successful, Invalid Credentials"
              );
            }
          );
        }
      });
    }
  }
}
