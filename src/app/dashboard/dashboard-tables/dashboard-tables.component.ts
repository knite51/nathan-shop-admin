import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-dashboard-tables",
  templateUrl: "./dashboard-tables.component.html",
  styleUrls: ["./dashboard-tables.component.css"]
})
export class DashboardTablesComponent implements OnInit {
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
  dataSource = [];
  filterValue = "";

  pageTitle = "";
  loggedInShop: any = {};

  constructor(
    private endpoints: EndpointsService,
    private route: ActivatedRoute,
    private router: Router,
    localStorage: LocalStorageService
  ) {
    this.loggedInShop = JSON.parse(
      localStorage.getFromLocalStorage("ShopDetails")
    );

    this.route.queryParams.subscribe(res => {
      const { viewpage } = res;
      this.pageTitle = viewpage;
      this.getPageDetails(viewpage);
    });
  }

  private getPageDetails(type) {
    let apiUrl = "";
    switch (type) {
      case "Users":
        apiUrl = `${this.endpoints.adminUsersUrl.createGetUpdateDeleteAdmin}/list`;
        break;
      case "Total-Products":
        apiUrl = `${this.endpoints.productsUrl.createGetUpdateDeleteProducts}/list/${this.loggedInShop.uuid}`;
        break;
      case "Completed-Orders":
        apiUrl = `${this.endpoints.ordersUrl.completed}`;
        break;
      case "Pending-Orders":
        apiUrl = `${this.endpoints.ordersUrl.getPending}`;
        break;
    }
    this.endpoints.fetch(apiUrl).subscribe(res => {
      console.log(res, "information");
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
    this.dataSource = data;
  }

  ngOnInit() {}

  applyFilter(filterValue: string) {
    if (filterValue) {
      let apiUrl = "";
      this.filterValue = filterValue;
      switch (this.pageTitle) {
        case "Users":
          apiUrl = `${
            this.endpoints.adminCategoryUrl.createGetUpdateDeleteAdminCategory
          }/search?q=${filterValue.toLowerCase()}&perPage=10`;
          break;
        case "Total-Products":
          apiUrl = `${
            this.endpoints.productsUrl.createGetUpdateDeleteProducts
          }/search?product=${filterValue.toLowerCase()}&perPage=10`;
          break;
        case "Completed-Orders":
          apiUrl = `${
            this.endpoints.ordersUrl.getViewOrders
          }/search?q=${filterValue.toLowerCase()}&perPage=10&status=completed`;
          break;
        case "Pending-Orders":
          apiUrl = `${
            this.endpoints.ordersUrl.getViewOrders
          }/search?q=${filterValue.toLowerCase()}&perPage=10&status=pending`;
          break;
      }
      this.endpoints.fetch(apiUrl).subscribe(res => {
        // console.log(res, "filted res");
        res !== null ? this.setDataSource(res) : (this.dataSource = []);
      });
    } else {
      this.getPageDetails(this.pageTitle);
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleReloadOnPagination(pageNumber) {
    let apiUrl = "";
    switch (this.pageTitle) {
      case "Users":
        apiUrl = `https://api-dev.natanshield.com/api/v1/shop/customers/list?page=${pageNumber}`;
        break;
      case "Total-Products":
        apiUrl = `https://api-dev.natanshield.com/api/v1/products/list/${this.loggedInShop.uuid}?perPage=10&page=${pageNumber}`;
        break;
      case "Completed-Orders":
        apiUrl = `https://api-dev.natanshield.com/api/v1/shop/orders/list?status=completed&page=${pageNumber}`;
        break;
      case "Pending-Orders":
        apiUrl = `https://api-dev.natanshield.com/api/v1/shop/orders/list?status=pending&page=${pageNumber}`;
        break;
    }
    this.endpoints.fetchPaginationPage(apiUrl).subscribe(res => {
      console.log(res, "pagenate reload pageNumber");
      this.paginationUrl = {
        ...this.paginationUrl,
        viewCountStart: 10 * pageNumber + 1 - 10,
        viewCountEnd: 10 * pageNumber
      };
      this.setDataSource(res);
    });
  }

  handleNavigationView(id) {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate([`/ordersInsight/view`, id], {
      queryParams: { redirectTo: redirect }
    });
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
    this.router.navigate(["/ordersInsight/pages/", pageNumber]);
  }
}
