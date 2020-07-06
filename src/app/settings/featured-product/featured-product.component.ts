import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { LocalStorageService } from "src/app/utils/localStorage.service";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-featured-product",
  templateUrl: "./featured-product.component.html",
  styleUrls: ["./featured-product.component.css"]
})
export class FeaturedProductComponent implements OnInit {
  selectedProductId = "";
  productList;

  featuredDetails = { products: [] };
  productsNameForDisplay = new BehaviorSubject<any>([]);

  // For Table
  totalItemCount = 0;
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dataSourceProductFeatured = [];

  loggedInShop: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private endpoints: EndpointsService,
    public genServ: GeneralService,
    localStorage: LocalStorageService
  ) {
    this.loggedInShop = JSON.parse(
      localStorage.getFromLocalStorage("ShopDetails")
    );
    const shopId = this.loggedInShop.uuid;
    this.getProducts(shopId);
    this.route.params.subscribe((par: Params) => {
      const { pageNumber } = par;
      Number(pageNumber) === 1
        ? this.getFeaturedProducts()
        : this.handleReloadOnPagination(pageNumber, shopId);
    });
  }

  ngOnInit() {}

  private getProducts(id) {
    const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/list/${id}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      this.productList = data;
    });
  }

  private getFeaturedProducts() {
    const apiUrl = `${this.endpoints.productsUrl.featuredProduct}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      this.setDataSourceProductFeatured(res);
    });
  }

  private setDataSourceProductFeatured(res) {
    const {
      data,
      links: { next, prev, first, last },
      meta: { total }
    } = res;
    this.totalItemCount = total;
    // set pagination next, previous and page counts values
    this.paginationUrl = { ...this.paginationUrl, next, prev };
    // check if page is the lastnext, then set page count to total item count
    this.paginationUrl.next !== null
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = this.totalItemCount);
    // check if page is the lastprevious, then set page count to perPage count[10]
    this.paginationUrl.prev !== null
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = 10);
    // check if page is the single, then set page count to perPage count[count]
    total > this.paginationUrl.viewCountEnd
      ? this.paginationUrl
      : (this.paginationUrl.viewCountEnd = total);
    this.dataSourceProductFeatured = data;
  }

  handleSaveToProductsArr() {
    this.featuredDetails.products.push(this.selectedProductId);
    this.productList.forEach(element => {
      if (element.uuid === this.selectedProductId) {
        // Append to a behavioural Subject
        const currentValue = this.productsNameForDisplay.value;
        const updatedValue = [...currentValue, element.name];
        this.productsNameForDisplay.next(updatedValue);
        return;
      }
    });
  }

  handleSetFeaturedProducts() {
    const payload = this.featuredDetails;
    if (typeof payload === "string") {
      this.genServ.sweetAlertHTML("Validation", payload);
    } else {
      const apiUrl = `${this.endpoints.productsUrl.featuredProduct}`;
      this.genServ.sweetAlertCreate("Featured Product").then(response => {
        if (response.value) {
          // console.log(payload, "payoe");
          this.endpoints.updateWithPatch(apiUrl, payload).subscribe(
            (res: any) => {
              console.log(res, "response");
              if ((res.message = "Featured Product updated")) {
                this.getFeaturedProducts();
                this.genServ
                  .sweetAlertSucess(
                    `Featured Product Created`,
                    `Featured Product added`
                  )
                  .then(res => {
                    // clear form fields
                    this.featuredDetails = {
                      products: []
                    };
                    this.productsNameForDisplay.next([]);
                  });
              }
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! Featured Product could not be added`
              );
            }
          );
        }
      });
    }
  }

  handleReloadOnPagination(pageNumber, shopReloadId?) {
    if (shopReloadId) {
      this.endpoints
        .fetchPaginationPage(
          `https://api.natanmarket.com/api/v1/shop/theme/featured_products?perPage=10&page=${pageNumber}`
        )
        .subscribe(res => {
          this.paginationUrl = {
            ...this.paginationUrl,
            viewCountStart: 10 * pageNumber + 1 - 10,
            viewCountEnd: 10 * pageNumber
          };
          this.setDataSourceProductFeatured(res);
        });
    }
  }

  handlePagination(type) {
    let url: string;
    if (type === "next") {
      url = this.paginationUrl.next;
    } else if (type === "previous") {
      url = this.paginationUrl.prev;
    }
    const pageNumberIndex = url.indexOf("page=") + 5;
    // set pagenavigation to 1 on last previous -> indexOf will give wrong value
    const pageNumber = url.includes("page=")
      ? url.substring(pageNumberIndex)
      : 1;
    this.router.navigate([
      "/settings/set-featured-products/pages/",
      pageNumber
    ]);
  }

  backToPreviousPage() {
    this.router.navigate(["/settings/dashboard"]);
  }
}
