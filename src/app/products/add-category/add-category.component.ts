import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.css"]
})
export class AddCategoryComponent implements OnInit {
  shopList: any;
  categoryDetails = {
    shop: "",
    name: ""
  };
  formData = new FormData();
  loggedInShop: any = {};
  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {
    this.loggedInShop = JSON.parse(
      this.localStorage.getFromLocalStorage("ShopDetails")
    );
    // set shop id
    this.categoryDetails.shop = this.loggedInShop.uuid;
  }

  ngOnInit() {}

  private get categoryValidatedDetails() {
    let validationFields = "";
    const obj = this.categoryDetails;

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...this.categoryDetails } : validationFields;
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];
      this.formData.append("image", image);

      console.log("eokeitn");
    }
  }

  handleCategoryCreation() {
    this.endpoints.httpStatus = "createProductImage";
    const payload = this.categoryValidatedDetails;
    if (typeof payload === "string") {
      this.genServ.sweetAlertHTML("Validation", payload);
    } else {
      this.formData.append("name", payload.name);
      this.formData.append("shop", payload.shop);

      const apiUrl = `${this.endpoints.adminCategoryUrl.createGetUpdateDeleteAdminCategory}/add`;
      this.genServ.sweetAlertCreate("Category").then(response => {
        if (response.value) {
          this.endpoints.create(apiUrl, this.formData).subscribe(
            (res: any) => {
              console.log(res, "response");
              this.genServ
                .sweetAlertSucess(`Category Created`, `Category has been added`)
                .then(res2 => {
                  // clear form fields
                  this.categoryDetails = {
                    shop: "",
                    name: ""
                  };
                });
              this.endpoints.httpStatus = "allCalls";
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! Category could not be created`
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
      this.router.navigate(["/productInsight/categories/pages/1"]);
    }
  }
}
