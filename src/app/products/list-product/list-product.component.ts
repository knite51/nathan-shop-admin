import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"]
})
export class ListProductComponent implements OnInit {
  myplaceHolder = "Filter";
  filterSearch;
  totalItemCount = 0;
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dataSourceProducts = [];

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
    this.route.params.subscribe((par: Params) => {
      const { pageNumber } = par;
      Number(pageNumber) === 1
        ? this.getProducts(shopId)
        : this.handleReloadOnPagination(pageNumber, shopId);
    });
  }

  ngOnInit() {}

  private getProducts(id) {
    const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/list/${id}`;
    this.endpoints.fetch(apiUrl).subscribe(res => {
      console.log(res, "product");
      this.setDataSource(res);
    });
  }

  private setDataSource(res) {
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

    this.dataSourceProducts = data;
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      const apiUrl = `${
        this.endpoints.productsUrl.createGetUpdateDeleteProducts
      }/search?product=${filterValue.toLowerCase()}&perPage=10`;
      this.endpoints.fetch(apiUrl).subscribe((res: any) => {
        res !== null ? this.setDataSource(res) : (this.dataSourceProducts = []);
      });
    } else {
      this.getProducts(this.loggedInShop.uuid);
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  hidShowPlaceHolder(value, type) {
    if (type === "onFocus" || value) {
      this.myplaceHolder = "";
      return;
    } else if (type === "onBlur" && !value) {
      this.myplaceHolder = "Filter";
      return;
    }
  }

  handleAddProductNav() {
    let type = "bulk";
    this.router.navigate([`/productInsight/add`], {
      queryParams: { productAddType: type }
    });
  }

  handleNavigationView(id, type) {
    if (type === "edit") {
      this.router.navigate(["/productInsight/view/", id], {
        queryParams: { nextView: "edit" }
      });
    } else {
      let redirect = "";
      this.route.snapshot.url.forEach((res: any) => {
        redirect += res.path + "/";
      });
      this.router.navigate([`/productInsight/view`, id], {
        queryParams: { redirectTo: redirect }
      });
    }
  }

  handleReloadOnPagination(pageNumber, shopId) {
    this.endpoints
      .fetchPaginationPage(
        `https://api.natanmarket.com/api/v1/products/list/${shopId}?perPage=10&page=${pageNumber}`
      )
      .subscribe(res => {
        this.paginationUrl = {
          ...this.paginationUrl,
          viewCountStart: 10 * pageNumber + 1 - 10,
          viewCountEnd: 10 * pageNumber
        };
        this.setDataSource(res);
      });
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
    this.router.navigate(["/productInsight/pages/", pageNumber]);
  }

  handleProductDelete(id) {
    this.genServ.sweetAlertDeletions("Product").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}`;
        this.endpoints.delete(apiUrl, id).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.getProducts(this.loggedInShop.uuid);
              this.genServ.sweetAlertSucess(
                "Product Deleted",
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
}
