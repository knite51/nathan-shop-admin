import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";

@Component({
  selector: "app-view-product",
  templateUrl: "./view-product.component.html",
  styleUrls: ["./view-product.component.css"]
})
export class ViewProductComponent implements OnInit {
  product = {
    name: "",
    price: "",
    description: "",
    sku: "",
    images: [],
    category: <any>{},
    options: [
      {
        weight: "",
        color: "",
        size: ""
      }
    ]
  };
  productId;
  editView = false;
  selectedShop = "";
  imageLoaded = false;
  categories = [];
  selectedDeleteImage = "";

  uploadImage = new FormData();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private genServ: GeneralService,
    private endpoints: EndpointsService
  ) {
    this.route.params.subscribe(res => {
      const { productId } = res;
      this.productId = productId;
      this.getProduct(productId);
    });
    this.handleReloadView();
  }

  ngOnInit() {}

  private getProduct(id) {
    const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/details/${id}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      this.product = {
        name: data.name,
        price: data.price,
        description: data.description,
        sku: data.sku,
        images: data.images,
        category: data.category,
        options: data.options
      };
      this.selectedShop = data.shop.name;
      this.getCategories(data.shop.uuid);
      console.log(this.product, "data");
    });
  }

  private getCategories(id) {
    const apiUrl = `${this.endpoints.categoriesUrl.getUpdateCategoryByShops}/list/${id}?for=list`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      this.categories = data;
    });
  }

  private get productUpdatedDetails() {
    let validationFields = "";
    const obj = this.product;

    for (const key in obj) {
      if (!obj[key] && key !== "options" && key !== "images") {
        validationFields += `${key} cannot be blank <br/>`;
      } else if (key === "category") {
        this.product.category = this.product.category.uuid;
      }
    }
    return !validationFields ? { ...this.product } : validationFields;
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  handleReloadView() {
    this.route.queryParams.subscribe((par: Params) => {
      if (Object.keys(par).length > 0) {
        const { nextView } = par;
        this.editView = nextView === "edit" ? true : false;
      } else {
        this.editView = false;
      }
    });
  }

  handleEditView(type) {
    if (type === "edit") {
      this.router.navigate(["/productInsight/view/", this.productId], {
        queryParams: { nextView: "edit" }
      });
    } else {
      this.router.navigate(["/productInsight/view/", this.productId]);
    }
    this.handleReloadView();
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];
      this.uploadImage.append("image", image);
    }
  }

  handleProductUpdate() {
    const productUpdatedDetails: any = this.productUpdatedDetails;
    console.log(productUpdatedDetails, "productUpdatedDetails");
    if (typeof productUpdatedDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", productUpdatedDetails);
    } else {
      this.genServ.sweetAlertUpdates("Product").then(response => {
        if (response.value) {
          const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/${this.productId}`;
          this.endpoints
            .updateWithPatch(apiUrl, productUpdatedDetails)
            .subscribe(
              (res: any) => {
                // console.log(res, "updateproductresponse");
                // Reload View with backend data

                this.endpoints.httpStatus = "createProductImage";
                const { message, data } = res;

                if (
                  message === "Product updated successfully." &&
                  this.uploadImage.get("image") !== null
                ) {
                  const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/${data.uuid}/image`;
                  this.endpoints.create(apiUrl, this.uploadImage).subscribe(
                    (res: any) => {
                      console.log(res, "imageRespoinse");
                      this.getProduct(this.productId);

                      this.genServ.sweetAlertSucess(
                        "Product Updated",
                        "Product Updated Successfully"
                      );
                    },
                    error => {
                      // console.log(error.message.errors, "fjdj");
                      this.genServ.sweetAlertSucess(
                        "Product Updated Partly",
                        `Product Updated But Image not Uploaded. Edit and Try again
                      Error - ${JSON.stringify(error.message.errors)}
                      `
                      );
                    }
                  );
                } else {
                  this.getProduct(this.productId);
                  this.genServ.sweetAlertSucess(
                    "Product Updated",
                    "Product Updated Successfully"
                  );
                }
              },
              error => {
                console.log(error, "erroring");
                this.genServ.sweetAlertAuthVerification(
                  "Error!! Product could not be updated"
                );
              }
            );
        }
      });
    }
  }

  handleProductDelete() {
    this.genServ.sweetAlertDeletions("Product").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}`;
        this.endpoints.delete(apiUrl, this.productId).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.genServ.sweetAlertSucess(
                "Product Deleted",
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

  handleDeleteImage() {
    this.genServ.sweetAlertDeletions("Product Image").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/image`;
        this.endpoints
          .delete(apiUrl, this.selectedDeleteImage)
          .subscribe(res => {
            console.log(res, "adter");
            this.getProduct(this.productId);
            this.genServ.sweetAlertSucess(
              "Product Image Deleted",
              "Deletion Successful"
            );
          });
      }
    });
  }

  backToPreviousPage() {
    if (this.route.snapshot.queryParams.redirectTo) {
      this.router.navigate([this.route.snapshot.queryParams.redirectTo]);
    } else {
      this.router.navigate(["/productInsight/pages/1"]);
    }
  }
}
