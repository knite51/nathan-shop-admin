import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"]
})
export class AddProductComponent implements OnInit {
  product = {
    name: "",
    shop: "",
    price: "",
    description: "",
    sku: "",
    images: [],
    category: "",
    options: [
      {
        weight: "",
        color: "",
        size: ""
      }
    ]
  };

  uploadImage = new FormData();
  uploadBulkProduct = new FormData();

  loggedInShop: any = {};
  categories;
  viewType = "single";
  CSV = false;

  constructor(
    private endpoints: EndpointsService,
    private genServ: GeneralService,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {
    this.loggedInShop = JSON.parse(
      this.localStorage.getFromLocalStorage("ShopDetails")
    );
    // set shop id
    this.product.shop = this.loggedInShop.uuid;
    this.route.queryParams.subscribe(res => {
      const { productAddType } = res;
      if (productAddType) {
        this.viewType = "bulk";
      } else {
        this.viewType = "single";
      }
    });
  }

  ngOnInit() {
    this.getCategories(this.loggedInShop.uuid);
  }

  private getCategories(id) {
    const apiUrl = `${this.endpoints.categoriesUrl.getUpdateCategoryByShops}/list/${id}?for=list`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      this.categories = data;
    });
  }

  private get productDetails() {
    let validationFields = "";
    const obj = this.product;

    for (const key in obj) {
      if (!obj[key] && key !== "options" && key !== "images") {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...this.product } : validationFields;
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0];
      this.uploadImage.append("image", image);
    }
  }

  handleFileInputBulk(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file, "file");
      if (file.type === "text/csv") {
        this.CSV = true;

        this.uploadBulkProduct.append("shop", this.loggedInShop.uuid);
        this.uploadBulkProduct.append("csv_file", file);
      } else {
        this.CSV = false;
        this.genServ.sweetAlertAuthVerification(
          "Error!! File must be in .csv format"
        );
      }
    }
  }

  handleProductCreation() {
    const productDetails = this.productDetails;
    console.log(productDetails, "productDetails");
    if (typeof productDetails === "string") {
      this.genServ.sweetAlertHTML("Validation", productDetails);
    } else {
      this.genServ.sweetAlertCreate("Product").then(response => {
        if (response.value) {
          const apiUrl =
            this.endpoints.productsUrl.createGetUpdateDeleteProducts + "/add";
          this.endpoints.create(apiUrl, productDetails).subscribe(
            (res: any) => {
              console.log(res, "response");
              this.endpoints.httpStatus = "createProductImage";
              const { message, data } = res;
              // clear form fields
              this.product = {
                name: "",
                price: "",
                shop: "",
                description: "",
                sku: "",
                images: [],
                category: "",
                options: [
                  {
                    weight: "",
                    color: "",
                    size: ""
                  }
                ]
              };
              if (message === "Product added successfully.") {
                if (this.uploadImage.get("image") !== null) {
                  const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/${data.uuid}/image`;
                  this.endpoints.create(apiUrl, this.uploadImage).subscribe(
                    (res: any) => {
                      console.log(res, "imageRespoinse");
                      this.genServ
                        .sweetAlertSucess(
                          "Product Created",
                          "Product Created Successfully"
                        )
                        .then(res => {});
                    },
                    error => {
                      // console.log(error.message.errors, "fjdj");
                      this.genServ.sweetAlertSucess(
                        "Product Created Partly",
                        `Product Created But Image not Uploaded. Edit and Try again
                        `
                      );
                      // Error - ${JSON.stringify(error.message.errors)}
                    }
                  );
                } else {
                  this.genServ
                    .sweetAlertSucess(
                      "Product Created",
                      "Product Created Successfully"
                    )
                    .then(res => {});
                }
              }
            },
            error => {
              console.log(error, "erroring");
              this.genServ.sweetAlertAuthVerification(
                "Error!! Product could not be created"
              );
            }
          );
        }
      });
    }
  }

  handleProductBulkCreation() {
    this.endpoints.httpStatus = "createProductImage";
    this.genServ.sweetAlertCreate("Product Bulk").then(response => {
      if (response.value) {
        const apiUrl = this.endpoints.productsUrl.uploadProductBulk;
        this.endpoints.create(apiUrl, this.uploadBulkProduct).subscribe(
          (res: any) => {
            console.log(res, "bulk upload successful");
            this.genServ.sweetAlertSucess(
              "Product Bulk Upload",
              "Product Bulk Upload Successful"
            );
          },
          error => {
            let errorMsgArray:Array<any> = [];
            for (const [key, value] of Object.entries(error.errors)) {
              errorMsgArray.push("<div>"+ key + ":" + value + "</div><br/>")
            }
            console.log(errorMsgArray)
            this.genServ.sweetAlertAuthVerification(
              errorMsgArray.length ? errorMsgArray.join("") : error.message
            );
          }
        );
      }
    });
  }
}
