import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-list-category",
  templateUrl: "./list-category.component.html",
  styleUrls: ["./list-category.component.css"]
})
export class ListCategoryComponent implements OnInit {
  myplaceHolder = "Filter";
  totalItemCount = 0;
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dateFilter = { from: "", to: "" };

  dataSourceCategories = [];
  loggedInShop: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private endpoint: EndpointsService,
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
        ? this.getCategories(shopId)
        : this.handleReloadOnPagination(pageNumber, shopId);
    });
  }

  ngOnInit() {}

  private getCategories(id) {
    const apiUrl = `${this.endpoint.categoriesUrl.getUpdateCategoryByShops}/list/${id}`;
    this.endpoint.fetch(apiUrl).subscribe(res => {
      console.log(res, "categories");
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

    this.dataSourceCategories = data;
  }

  applyFilter(filterValue) {
    if (filterValue) {
      const apiUrl = `${
        this.endpoint.categoriesUrl.getUpdateCategoryByShops
      }/search?q=${filterValue.toLowerCase()}`;
      this.endpoint.fetch(apiUrl).subscribe((res: any) => {
        res !== null
          ? this.setDataSource(res)
          : (this.dataSourceCategories = []);
      });
    } else {
      this.getCategories(this.loggedInShop.uuid);
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleReloadOnPagination(pageNumber, shopId) {
    this.endpoint
      .fetchPaginationPage(
        `https://api.natanmarket.com/api/v1/category/list/${shopId}?perPage=10&page=${pageNumber}`
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
    this.router.navigate(["/categoryInsight/pages/", pageNumber]);
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

  handleAddNavigation() {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate(["/categoryInsight/add"], {
      queryParams: { redirectTo: redirect }
    });
  }

  handleNavigationView(id) {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate([`categoryInsight/view`, id], {
      queryParams: { redirectTo: redirect }
    });
  }

  handleShopDelete(id) {
    this.genServ.sweetAlertDeletions("Category").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoint.categoriesUrl.deleteCategory}`;
        this.endpoint.delete(apiUrl, id).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.getCategories(this.loggedInShop.uuid);
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
}
