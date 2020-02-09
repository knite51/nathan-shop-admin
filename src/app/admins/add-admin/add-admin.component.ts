import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";

@Component({
  selector: "app-add-admin",
  templateUrl: "./add-admin.component.html",
  styleUrls: ["./add-admin.component.css"]
})
export class AddAdminComponent implements OnInit {
  adminUser = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: ""
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private genServ: GeneralService,
    private endpoints: EndpointsService
  ) {}

  ngOnInit() {}

  private get adminUserDetails() {
    let validationFields = "";
    const obj = this.adminUser;

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...obj } : validationFields;
  }

  handleAdminCreation() {
    const payload = this.adminUserDetails;
    if (typeof payload === "string") {
      this.genServ.sweetAlertHTML("Validation", payload);
    } else {
      const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/add`;
      this.genServ.sweetAlertCreate("Admin User").then(response => {
        if (response.value) {
          console.log(payload, "payoe");
          this.endpoints.create(apiUrl, payload).subscribe(
            (res: any) => {
              console.log(res, "response");
              this.genServ
                .sweetAlertSucess(`Admin User Created`, `User has been added`)
                .then(res2 => {
                  // clear form fields
                  this.adminUser = {
                    first_name: "",
                    last_name: "",
                    email: "",
                    role: "",
                    password: ""
                  };
                });
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! User could not be created`
              );
            }
          );
        }
      });
    }
  }

  backToPreviousPage() {
    if (this.route.snapshot.queryParams.redirectTo) {
      this.router.navigate([this.route.snapshot.queryParams.redirectTo]);
    } else {
      this.router.navigate(["/adminUserInsight/pages/1"]);
    }
  }
}
