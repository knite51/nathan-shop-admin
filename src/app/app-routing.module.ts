import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ListProductComponent } from "./products/list-product/list-product.component";
import { ViewProductComponent } from "./products/view-product/view-product.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
// import { ListShopComponent } from "./shops/list-shop/list-shop.component";
// import { ViewShopComponent } from "./shops/view-shop/view-shop.component";
// import { AddShopComponent } from "./shops/add-shop/add-shop.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./auth/auth.guard";
import { ListDefaultShopComponent } from "./settings/list-default-shop/list-default-shop.component";
import { AddDefaultShopComponent } from "./settings/add-default-shop/add-default-shop.component";
import { ViewDefaultShopComponent } from "./settings/view-default-shop/view-default-shop.component";
import { ListAdminComponent } from "./admins/list-admin/list-admin.component";
import { AddAdminComponent } from "./admins/add-admin/add-admin.component";
import { AssignViewAdminComponent } from "./admins/assign-view-admin/assign-view-admin.component";
import { ProductCategoryDashboardComponent } from "./products/product-category-dashboard/product-category-dashboard.component";
import { AddCategoryComponent } from "./products/add-category/add-category.component";
import { ListCategoryComponent } from "./products/list-category/list-category.component";
import { ViewCategoryComponent } from "./products/view-category/view-category.component";
import { ListOrdersComponent } from "./orders/list-orders/list-orders.component";
import { ViewOrdersComponent } from "./orders/view-orders/view-orders.component";
import { SettingsDasboardComponent } from "./settings/settings-dasboard/settings-dasboard.component";
import { SetPaymentComponent } from "./settings/payments/set-payment/set-payment.component";
import { UserProfileComponent } from "./admins/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: "adminDashboard",
    component: DashboardComponent
  },
  {
    path: "admin-user-profile",
    component: UserProfileComponent
  },
  {
    path: "adminUserInsight/pages/:pageNumber",
    component: ListAdminComponent
  },
  {
    path: "adminUserInsight/add",
    component: AddAdminComponent
  },
  {
    path: "adminUserInsight/:userId/view-assign",
    component: AssignViewAdminComponent
  },
  {
    path: "adminDashboard",
    component: DashboardComponent
  },
  {
    path: "product-category-dashboard",
    component: ProductCategoryDashboardComponent
  },
  {
    path: "productInsight/pages/:pageNumber",
    component: ListProductComponent
  },
  {
    path: "productInsight/categories/pages/:pageNumber",
    component: ListCategoryComponent
  },
  {
    path: "productInsight/view/:productId",
    component: ViewProductComponent
  },
  {
    path: "productInsight/category/view/:categoryId",
    component: ViewCategoryComponent
  },
  {
    path: "productInsight/add",
    component: AddProductComponent
  },
  {
    path: "productInsight/category/add",
    component: AddCategoryComponent
  },
  // {
  //   path: "shopsInsight/pages/:pageNumber",
  //   component: ListShopComponent,
  //
  // },
  // {
  //   path: "shopsInsight/view/:shopId",
  //   component: ViewShopComponent,
  //
  // },
  // {
  //   path: "shopsInsight/add",
  //   component: AddShopComponent,
  //
  // },
  {
    path: "ordersInsight/pages/:pageNumber",
    component: ListOrdersComponent
  },
  {
    path: "ordersInsight/view/:orderId",
    component: ViewOrdersComponent
  },
  {
    path: "settings/dashboard",
    component: SettingsDasboardComponent
  },
  {
    path: "settings/default-shops/pages/:pageNumber",
    component: ListDefaultShopComponent
  },
  {
    path: "settings/add-default-shop",
    component: AddDefaultShopComponent
  },
  {
    path: "settings/view-default-shop/:shopId",
    component: ViewDefaultShopComponent
  },
  {
    path: "settings/set-payment-method",
    component: SetPaymentComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  { path: "", redirectTo: "adminDashboard", pathMatch: "full" },
  { path: "**", redirectTo: "adminDashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
