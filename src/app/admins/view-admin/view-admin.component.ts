import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-view-admin",
  templateUrl: "./view-admin.component.html",
  styleUrls: ["./view-admin.component.css"]
})
export class ViewAdminComponent implements OnInit {
  shopList: any;
  adminId;
  userDetails = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
    shops_assigned_to: []
  };


  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe(res => {
      const { adminId } = res;
      this.adminId = adminId;
      this.getAdminDetails(adminId);
    });
  }

  ngOnInit() {}

  private getAdminDetails(adminId) {
    const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/details/${adminId}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      this.userDetails = res.data;
    });
  }


  private get adminUserUpdatedDetails() {
    let validationFields = "";
    const obj = this.userDetails;

    for (const key in this.userDetails) {
      if (key === "uuid") {
        delete obj[key];
      }
    }

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...obj } : validationFields;
  }


  handleAdminUpdate() {
    const adminUserUpdatedDetails = this.adminUserUpdatedDetails;
    console.log(adminUserUpdatedDetails, "update");
    if (typeof adminUserUpdatedDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", adminUserUpdatedDetails);
    } else {
      this.genServ.sweetAlertUpdates("Admin User").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/update/${this.adminId}`;
          this.endpoints
            .updateWithPatch(apiUrl, adminUserUpdatedDetails)
            .subscribe(
              res => {
                this.genServ.sweetAlertSucess(
                  "Admin User Updated",
                  "Update Successful"
                );
                this.getAdminDetails(this.adminId);
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

  handleAdminUserDelete() {
    this.genServ.sweetAlertDeletions("Admin User").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/delete`;
        this.endpoints.delete(apiUrl, this.adminId).subscribe(
          (res: any) => {
            const { status_code } = res;
            if (status_code === 200) {
              this.backToPreviousPage();
              this.genServ.sweetAlertSucess(
                "Admin User Deleted",
                "Deletion Successful"
              );
            }
          },
          error => {
            console.log(error, "error on delete");
            this.genServ.sweetAlertError("Sorry, Delete Not Successful");
          }
        );
      }
    });
  }

  backToPreviousPage() {
    if (this.router.snapshot.queryParams.redirectTo) {
      this.route.navigate([this.router.snapshot.queryParams.redirectTo]);
    } else {
      this.route.navigate(["/adminUserInsight/pages/1"]);
    }
  }
}
