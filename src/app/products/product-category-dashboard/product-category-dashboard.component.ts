import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-product-category-dashboard",
  templateUrl: "./product-category-dashboard.component.html",
  styleUrls: ["./product-category-dashboard.component.css"]
})
export class ProductCategoryDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  handleProductNav() {
    let type = "bulk";
    this.router.navigate([`/productInsight/add`], {
      queryParams: { productAddType: type }
    });
  }
}
