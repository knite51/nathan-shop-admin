import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-list-orders",
  templateUrl: "./list-orders.component.html",
  styleUrls: ["./list-orders.component.css"]
})
export class ListOrdersComponent implements OnInit {
  myplaceHolder = "Filter";
  filterStatus = "Activate";
  filterColumn = "Date";
  filterSearch;
  filterValue = "";
  totalItemCount = 0;
  dateFilter = { from: "", to: "" };
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dataSource = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private endpoint: EndpointsService,
    private genServ: GeneralService,
    localStorage: LocalStorageService
  ) {
    this.route.params.subscribe((par: Params) => {
      const { pageNumber } = par;
      Number(pageNumber) === 1
        ? this.getOrders()
        : this.handleReloadOnPagination(pageNumber);
    });
  }

  private getOrders() {
    const apiUrl = `${this.endpoint.ordersUrl.getViewOrders}/list/`;
    this.endpoint.fetch(apiUrl).subscribe(res => {
      // console.log(res, "orders");
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

  handleDateFilter(value, type) {
    if (type === "from") {
      this.dateFilter.from = value;
    } else {
      this.dateFilter.to = value;
    }
    // console.log(this.dateFilter, "lol");
    if (this.dateFilter.from && this.dateFilter.to) {
      const apiUrl = `${this.endpoint.ordersUrl.searchOrders}/search?q=${this.filterValue}&perPage=10&${this.dateFilter.from}/${this.dateFilter.to}`;
      this.endpoint.fetch(apiUrl).subscribe(res => {
        // console.log(res, "datefilter");
        this.setDataSource(res);
      });
    }
  }

  applyFilter(filterValue: string) {
    if (filterValue) {
      this.filterValue = filterValue;
      const apiUrl = `${
        this.endpoint.ordersUrl.searchOrders
      }q=${filterValue.toLowerCase()}&perPage=10`;
      this.endpoint.fetch(apiUrl).subscribe(res => {
        // console.log(res, "filted res");
        res !== null ? this.setDataSource(res) : (this.dataSource = []);
      });
    } else {
      this.getOrders();
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleReloadOnPagination(pageNumber) {
    // console.log(pageNumber, "hlo");
    this.endpoint
      .fetchPaginationPage(
        `https://api-dev.natanshield.com/api/v1/shop/orders/list?perPage=10&page=${pageNumber}`
      )
      .subscribe(res => {
        // console.log(res, "pagenate reload pageNumber");
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

  handleDateFilterActivation() {
    if (this.filterStatus === "Activate") {
      this.filterStatus = "Deactivate";
    } else {
      this.filterStatus = "Activate";
      // this.getTransactions();
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
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
