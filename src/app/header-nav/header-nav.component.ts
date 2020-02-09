import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { LocalStorageService } from "../utils/localStorage.service";

@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  styleUrls: ["./header-nav.component.css"]
})
export class HeaderNavComponent implements OnInit {
  userDetails: any = {};
  shopDetails: any = {};
  constructor(
    private localstorage: LocalStorageService,
    private authServ: AuthService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(
      this.localstorage.getFromLocalStorage("ShopAdminUserInfo")
    );
    this.shopDetails = JSON.parse(
      this.localstorage.getFromLocalStorage("ShopDetails")
    );
  }

  handlelogout() {
    this.authServ.logout();
  }
}
