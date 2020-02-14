import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { LocalStorageService } from "./utils/localStorage.service";
import { GeneralService } from "./services/general.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "nathan-admin";
  loginRegisterResetPwdUrl = true;

  constructor(
    location: Location,
    router: Router,
    private localStorage: LocalStorageService,
    private genServ: GeneralService
  ) {
    router.events.subscribe(val => {
      this.loginRegisterResetPwdUrl =
        location.path().includes("/login") ||
        location.path().includes("/reset-password")
          ? true
          : false;
    });
  }

  ngOnInit() {
    // set roles view grant
    if (this.localStorage.getFromLocalStorage("ShopAdminUserInfo") !== null) {
      const adminRole = JSON.parse(
        this.localStorage.getFromLocalStorage("ShopAdminUserInfo")
      ).role;
      adminRole === "shop_admin" || adminRole === "admin"
        ? this.genServ.permissionRole.next(true)
        : this.genServ.permissionRole.next(false);
    } else {
      this.genServ.permissionRole.next(false);
    }
  }

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
