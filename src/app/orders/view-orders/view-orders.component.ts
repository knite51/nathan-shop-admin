import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EndpointsService } from "src/app/services/config/endpoints.service";

@Component({
  selector: "app-view-orders",
  templateUrl: "./view-orders.component.html",
  styleUrls: ["./view-orders.component.css"]
})
export class ViewOrdersComponent implements OnInit {
  orderId;
  orderDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private endpoints: EndpointsService
  ) {
    this.route.params.subscribe(res => {
      const { orderId } = res;
      this.orderId = orderId;
      this.getOrder(orderId);
    });
  }

  private getOrder(id) {
    const apiUrl = `${this.endpoints.ordersUrl.getViewOrders}/details/${id}`;
    this.endpoints.fetch(apiUrl).subscribe((res: any) => {
      const { data } = res;
      console.log(data, "orders");
      this.orderDetails = data;
    });
  }

  ngOnInit() {}

  backToPreviousPage() {
    if (this.route.snapshot.queryParams.redirectTo) {
      this.router.navigate([this.route.snapshot.queryParams.redirectTo]);
    } else {
      this.router.navigate(["/ordersInsight/pages/1"]);
    }
  }
}
