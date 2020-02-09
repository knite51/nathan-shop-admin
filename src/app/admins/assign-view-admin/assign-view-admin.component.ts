import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-assign-view-admin",
  templateUrl: "./assign-view-admin.component.html",
  styleUrls: ["./assign-view-admin.component.css"]
})
export class AssignViewAdminComponent implements OnInit {
  shopList: any;
  userId;
  userDetails = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
    shops_assigned_to: []
  };
  selectedAssginedShop = "";
  selectedUnassignedShopId = "";

  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private route: Router,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe(res => {
      const { userId } = res;
      this.userId = userId;
      this.getAdminDetails(userId);
    });
  }

  ngOnInit() {}

  private getAdminDetails(userId) {
    const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/details/${userId}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      this.userDetails = res.data;
      this.getShops();
    });
  }

  private getShops() {
    const apiUrl = `${this.endpoints.shopUrl.createGetUpdateDeleteShop}/list?for=list`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      const arr = this.userDetails.shops_assigned_to.map(res =>
        res.name.toLowerCase()
      );
      this.shopList = data.filter(element => {
        return !arr.includes(element.name.toLowerCase());
      });
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

  handleAssignment() {
    if (this.selectedAssginedShop) {
      this.genServ.sweetAlertAssign("User").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.adminUsersUrl.assignToShop}`;
          const payload = {
            admin: this.userId,
            shop: this.selectedAssginedShop
          };
          this.endpoints.create(apiUrl, payload).subscribe(
            (res: any) => {
              this.getAdminDetails(this.userId);
              this.getShops();
              this.genServ
                .sweetAlertSucess(
                  `Admin User Assigned`,
                  `User has been assigned to Shop`
                )
                .then(res => {
                  // clear form fields
                  this.selectedAssginedShop = "";
                });
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! User could not be assigned`
              );
            }
          );
        }
      });
    } else {
      this.genServ.sweetAlertHTML(
        "Validation",
        "You must select a Shop to assign User to"
      );
    }
  }

  handleUnAssign() {
    if (this.selectedUnassignedShopId) {
      const shopId = this.selectedUnassignedShopId;
      console.log(shopId, "shopId");
      this.genServ.sweetAlertAssign("Unassign User").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.adminUsersUrl.unassignToShop}/${this.userId}`;
          console.log(apiUrl, "rlt");
          this.endpoints.delete(apiUrl, shopId).subscribe(
            (res: any) => {
              this.getAdminDetails(this.userId);
              this.getShops();
              this.genServ
                .sweetAlertSucess(
                  `Admin User Unassigned`,
                  `User has been unassigned`
                )
                .then(res => {
                  // clear form fields
                  this.selectedUnassignedShopId = "";
                });
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! User could not be unassigned`
              );
            }
          );
        }
      });
    } else {
      this.genServ.sweetAlertHTML(
        "Validation",
        "You must select a Shop to assign User to"
      );
    }
  }

  handleAdminUpdate() {
    const adminUserUpdatedDetails = this.adminUserUpdatedDetails;
    console.log(adminUserUpdatedDetails, "update");
    if (typeof adminUserUpdatedDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", adminUserUpdatedDetails);
    } else {
      this.genServ.sweetAlertUpdates("Admin User").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/update/${this.userId}`;
          this.endpoints
            .updateWithPatch(apiUrl, adminUserUpdatedDetails)
            .subscribe(
              res => {
                this.genServ.sweetAlertSucess(
                  "Admin User Updated",
                  "Update Successful"
                );
                this.getAdminDetails(this.userId);
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
        this.endpoints.delete(apiUrl, this.userId).subscribe(
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
