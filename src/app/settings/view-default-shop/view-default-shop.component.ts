import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-view-default-shop",
  templateUrl: "./view-default-shop.component.html",
  styleUrls: ["./view-default-shop.component.css"]
})
export class ViewDefaultShopComponent implements OnInit {
  shopId;
  shopName = {
    name: ""
  };
  constructor(
    private endpoint: EndpointsService,
    private genServ: GeneralService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(res => {
      const { shopId } = res;
      this.shopId = shopId;
      this.getDefaultShops(shopId);
    });
  }

  ngOnInit() {}

  private getDefaultShops(shopId) {
    const apiUrl = `${this.endpoint.defaultShopUrl.createGetUpdateDeleteDefaultShop}/details/${shopId}`;
    this.endpoint.fetch(apiUrl).subscribe((res: any) => {
      console.log(res, "single Shops");
      this.shopName.name = res.data.name;
      // this.setDataSource(res);
    });
  }

  private get updatedDefaultShopDetails(): any {
    let validationFields = "";
    const obj = this.shopName;

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...obj } : validationFields;
  }

  handleUpdateShop() {
    const updatedDefaultShopDetails = this.updatedDefaultShopDetails;
    console.log(updatedDefaultShopDetails, "update");
    if (typeof updatedDefaultShopDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", updatedDefaultShopDetails);
    } else {
      this.genServ.sweetAlertUpdates("Default Shop").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoint.defaultShopUrl.createGetUpdateDeleteDefaultShop}/update/${this.shopId}`;
          this.endpoint
            .updateWithPatch(apiUrl, updatedDefaultShopDetails)
            .subscribe(
              res => {
                console.log(res);
                this.genServ.sweetAlertSucess(
                  "Default Shop Updated",
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

  handleDefaultShopDelete() {
    this.genServ.sweetAlertDeletions("Default Shop").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoint.defaultShopUrl.createGetUpdateDeleteDefaultShop}/delete`;
        this.endpoint.delete(apiUrl, this.shopId).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.genServ.sweetAlertSucess(
                "Default Shop Deleted",
                "Deletion Successful"
              );
              this.backToPreviousPage();
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
    this.router.navigate([this.route.snapshot.queryParams.redirectTo]);
  }
}
