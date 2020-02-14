import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { GeneralService } from "../services/general.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  url = new Subject();
  isAdminUser = true;

  constructor(
    private router: Router,
    private authServ: AuthService,
    public genServ: GeneralService
  ) {
    router.events.subscribe(val => {
      this.url.next(window.location.href);
    });
  }

  ngOnInit() {}

  handleProductNav() {
    let type = "bulk";
    this.router.navigate([`/productInsight/add`], {
      queryParams: { productAddType: type }
    });
  }

  handlelogout() {
    this.authServ.logout();
  }
}
