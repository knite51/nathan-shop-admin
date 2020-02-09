import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ListProductComponent } from "./products/list-product/list-product.component";
import { ViewProductComponent } from "./products/view-product/view-product.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { LoginComponent } from "./auth/login/login.component";

import { ListAdminComponent } from "./admins/list-admin/list-admin.component";
import { AddAdminComponent } from "./admins/add-admin/add-admin.component";
import { ProductCategoryDashboardComponent } from "./products/product-category-dashboard/product-category-dashboard.component";
import { AddCategoryComponent } from "./products/add-category/add-category.component";
import { ListCategoryComponent } from "./products/list-category/list-category.component";
import { ViewCategoryComponent } from "./products/view-category/view-category.component";
import { SettingsDasboardComponent } from "./settings/settings-dasboard/settings-dasboard.component";
import { SetPaymentComponent } from "./settings/payments/set-payment/set-payment.component";
import { UserProfileComponent } from "./admins/user-profile/user-profile.component";
import { ViewAdminComponent } from "./admins/view-admin/view-admin.component";

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
    path: "adminUserInsight/view-admin/:adminId",
    component: ViewAdminComponent
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
    path: "categoryInsight/pages/:pageNumber",
    component: ListCategoryComponent
  },
  {
    path: "productInsight/view/:productId",
    component: ViewProductComponent
  },
  {
    path: "categoryInsight/view/:categoryId",
    component: ViewCategoryComponent
  },
  {
    path: "productInsight/add",
    component: AddProductComponent
  },
  {
    path: "categoryInsight/add",
    component: AddCategoryComponent
  },
  {
    path: "settings/dashboard",
    component: SettingsDasboardComponent
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
