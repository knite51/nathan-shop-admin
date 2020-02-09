import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { GeneralService } from "src/app/services/general.service";
import { BehaviorSubject } from "rxjs";

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
  isAdminUser = true;

  dataSourceCategories = [];
  shopList;
  seletectedShop = "";

  reload = false;
  reloadDetails = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private endpoint: EndpointsService,
    private genServ: GeneralService
  ) {
    this.route.params.subscribe((par: Params) => {
      const { pageNumber } = par;
      if (this.route.snapshot.queryParams.reload) {
        this.reloadDetails = this.route.snapshot.queryParams.reload.split("/");
        this.reload = true;
        Number(pageNumber) === 1
          ? this.getShops(this.reloadDetails)
          : this.handleReloadOnPagination(pageNumber, this.reloadDetails[0]);
      } else {
        this.reload = false;
        Number(pageNumber) === 1
          ? this.getShops()
          : this.handleReloadOnPagination(pageNumber);
      }
    });
  }

  ngOnInit() {}

  private getShops(shopReload?) {
    const apiUrl = `${this.endpoint.shopUrl.createGetUpdateDeleteShop}/list?for=list`;
    if (!shopReload) {
      this.endpoint.fetch(apiUrl).subscribe((res: any) => {
        const { data } = res;

        this.shopList = this.uniquifyShopName(data);
        this.seletectedShop = `${this.shopList[0].name} - ${this.shopList[0].uniqueId}`;
        this.getCategories(data[0].uuid);
        this.router.navigate(["/productInsight/categories/pages/1/"], {
          queryParams: {
            reload: `${data[0].uuid} / ${data[0].name}`
          }
        });
      });
    } else {
      this.endpoint.fetch(apiUrl).subscribe((res: any) => {
        const { data } = res;
        console.log(data, "data -reload");
        this.shopList = this.uniquifyShopName(data);
        this.seletectedShop = `${shopReload[1]}`;
        this.getCategories(shopReload[0]);
      });
    }
  }

  private uniquifyShopName(shopArrayObj) {
    let newArr = shopArrayObj.map(res => {
      const splitAddres = res.address.split(" ");
      res.uniqueId = `${splitAddres[0]} ${splitAddres[1]}`;
      return res;
    });
    // console.log(newArr, "newgirl");
    return newArr;
  }

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
      const apiUrl = `${this.endpoint.categoriesUrl.getUpdateCategoryByShops}/${
        this.reloadDetails[0]
      }/search?q=${filterValue.toLowerCase()}`;
      this.endpoint.fetch(apiUrl).subscribe((res: any) => {
        res !== null
          ? this.setDataSource(res)
          : (this.dataSourceCategories = []);
      });
    } else {
      this.getCategories(this.reloadDetails[0]);
      this.paginationUrl = {
        next: "",
        prev: "",
        viewCountStart: 1,
        viewCountEnd: 10
      };
    }
  }

  handleShopCategoriesFetch(formValue) {
    const spiltFormValue = formValue.split("&");
    const shopUUID = spiltFormValue[0],
      shopName = spiltFormValue[1],
      uniqueId = spiltFormValue[2];
    this.seletectedShop = `${shopName} - ${uniqueId}`;
    // this.getOrdersByShop(shopUUID);

    this.reload = false;
    this.getCategories(shopUUID);
    // this.seletectedShop = this.shopList.filter(res => res.uuid === id);
    const reload = {
      id: shopUUID,
      name: shopName
    };
    this.reloadDetails = [reload.id, reload.name];
    this.router.navigate(["/productInsight/categories/pages/1/"], {
      queryParams: {
        reload: `${reload.id} / ${reload.name}`
      }
    });
  }

  handleReloadOnPagination(pageNumber, shopReloadId?) {
    if (shopReloadId) {
      this.endpoint
        .fetchPaginationPage(
          `https://api-dev.natanshield.com/api/v1/super/category/list/${shopReloadId[0]}?perPage=10&page=${pageNumber}`
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
    this.router.navigate(["/productInsight/categories/pages/", pageNumber], {
      queryParams: {
        reload: `${this.reloadDetails[0]} / ${this.reloadDetails[1]}`
      }
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

  handleAddNavigation() {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate(["/productInsight/category/add"], {
      queryParams: { redirectTo: redirect }
    });
  }

  handleNavigationView(id) {
    let redirect = "";
    this.route.snapshot.url.forEach((res: any) => {
      redirect += res.path + "/";
    });
    this.router.navigate([`productInsight/category/view`, id], {
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
              this.getShops();
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
