import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { LocalStorageService } from "src/app/utils/localStorage.service";

@Component({
  selector: "app-list-admin",
  templateUrl: "./list-admin.component.html",
  styleUrls: ["./list-admin.component.css"]
})
export class ListAdminComponent implements OnInit {
  myplaceHolder = "Filter";
  totalItemCount = 0;
  paginationUrl = {
    next: "",
    prev: "",
    viewCountStart: 1,
    viewCountEnd: 10
  };
  pageNumber = 1;
  dataSource = [];
  loggedInShop: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private endpoint: EndpointsService,
    private genServ: GeneralService,
    localStorage: LocalStorageService
  ) {
    this.loggedInShop = JSON.parse(
      localStorage.getFromLocalStorage("ShopDetails")
    );
    const shopId = this.loggedInShop.uuid;
    this.route.params.subscribe((par: Params) => {
      const { pageNumber } = par;
      Number(pageNumber) === 1
        ? this.getAdminUsers(shopId)
        : this.handleReloadOnPagination(pageNumber, shopId);
    });
  }

  private getAdminUsers(shopId) {
    const apiUrl = `${this.endpoint.adminUsersUrl.createGetUpdateDeleteAdmin}/list/${shopId}`;
    this.endpoint.fetch(apiUrl).subscribe(res => {
      console.log(res, "admins");
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
      const apiUrl = `${
        this.endpoint.adminUsersUrl.createGetUpdateDeleteAdmin
      }/search/${
        this.loggedInShop.uuid
      }?q=${filterValue.toLowerCase()}&perPage=10`;
      this.endpoint.fetch(apiUrl).subscribe(res => {
        res !== null ? this.setDataSource(res) : (this.dataSource = []);
      });
    } else {
      this.getAdminUsers(this.loggedInShop.uuid);
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleReloadOnPagination(pageNumber, shopId) {
    console.log(pageNumber, "hlo");
    this.endpoint
      .fetchPaginationPage(
        `https://api-dev.natanshield.com/api/v1/shop/admin/list/${shopId}?perPage=10&page=${pageNumber}`
      )
      .subscribe(res => {
        console.log(res, "pagenate reload pageNumber");
        this.paginationUrl = {
          ...this.paginationUrl,
          viewCountStart: 10 * pageNumber + 1 - 10,
          viewCountEnd: 10 * pageNumber
        };
        this.setDataSource(res);
      });
  }

  handleNavigation() {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate(["/adminUserInsight/add"], {
      queryParams: { redirectTo: redirect }
    });
  }

  handleNavigationView(id) {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate([`/adminUserInsight/view-admin`, id], {
      queryParams: { redirectTo: redirect }
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
    this.router.navigate(["/adminUserInsight/pages/", pageNumber]);
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

  handleAdminUserDelete(id) {
    this.genServ.sweetAlertDeletions("Admin User").then(res => {
      if (res.value) {
        const apiUrl = `${this.endpoint.adminUsersUrl.createGetUpdateDeleteAdmin}/delete`;
        this.endpoint.delete(apiUrl, id).subscribe(
          (res: any) => {
            console.log(res);
            const { status_code } = res;
            if (status_code === 200) {
              this.getAdminUsers(this.loggedInShop.uuid);
              this.genServ.sweetAlertSucess(
                "Admin User Deleted",
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
