import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-view-category",
  templateUrl: "./view-category.component.html",
  styleUrls: ["./view-category.component.css"]
})
export class ViewCategoryComponent implements OnInit {
  shopList: any;
  categoryDetails = {
    shop: "",
    name: ""
  };
  formData = new FormData();
  categoryId;

  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(res => {
      const { categoryId } = res;
      this.categoryId = categoryId;
      // console.log(categoryId, "logld");
      this.getCategory(categoryId);
    });
  }

  private getCategory(id) {
    const apiUrl = `${this.endpoints.categoriesUrl.getUpdateCategoryByShops}/details/${id}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      console.log(data, "dataCate");
      this.categoryDetails = {
        name: data.name,
        shop: data.shop
      };
    });
  }

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

  ngOnInit() {
    // this.getShops();
  }

  handleSelectedCategory() {}

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];
      this.formData.append("image", image);

      console.log("eokeitn");
    }
  }

  handleCategoryUpdate() {
    this.endpoints.httpStatus = "createProductImage";
    const payload = this.categoryValidatedDetails;
    if (typeof payload === "string") {
      this.genServ.sweetAlertHTML("Validation", payload);
    } else {
      this.formData.append("name", payload.name);

      const apiUrl = `${this.endpoints.categoriesUrl.getUpdateCategoryByShops}/update/${this.categoryId}`;
      this.genServ.sweetAlertUpdates("Category").then(response => {
        if (response.value) {
          this.endpoints.create(apiUrl, this.formData).subscribe(
            (res: any) => {
              console.log(res, "response");
              this.genServ.sweetAlertSucess(
                `Category Updated`,
                `Category has been Updated`
              );
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! Category could not be update`
              );
            }
          );
        }
      });
    }
  }

  handleShopDelete() {
    this.genServ.sweetAlertDeletions("Category").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoints.categoriesUrl.deleteCategory}`;
        this.endpoints.delete(apiUrl, this.categoryId).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.backToPreviousPage();
              this.genServ.sweetAlertSucess(
                "Category Deleted",
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
    if (this.route.snapshot.queryParams.redirectTo) {
      this.router.navigate([this.route.snapshot.queryParams.redirectTo]);
    } else {
      this.router.navigate(["/productInsight/categories/pages/1"]);
    }
  }
}
