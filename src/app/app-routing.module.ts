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
import { UserProfileComponent } from "./admins/user-profile/user-profile.component";
import { ViewAdminComponent } from "./admins/view-admin/view-admin.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { ListOrdersComponent } from "./orders/list-orders/list-orders.component";
import { ViewOrdersComponent } from "./orders/view-orders/view-orders.component";
import { AuthGuard } from "./auth/auth.guard";
import { DashboardTablesComponent } from "./dashboard/dashboard-tables/dashboard-tables.component";
import { FeaturedProductComponent } from "./settings/featured-product/featured-product.component";
import { RecommendedProductComponent } from "./settings/recommended-product/recommended-product.component";
import { SettingsDasboardComponent } from "./settings/settings-dasboard/settings-dasboard.component";

const routes: Routes = [
  {
    path: "adminDashboard",
    component: DashboardComponent
  },
  {
    path: "adminDashboard/list",
    component: DashboardTablesComponent
  },
  {
    path: "admin-user-profile",
    component: UserProfileComponent
  },
  {
    path: "adminUserInsight/pages/:pageNumber",
    component: ListAdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "adminUserInsight/add",
    component: AddAdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "adminUserInsight/view-admin/:adminId",
    component: ViewAdminComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "adminDashboard",
    component: DashboardComponent
  },
  {
    path: "ordersInsight/pages/:pageNumber",
    component: ListOrdersComponent
  },
  {
    path: "ordersInsight/view/:orderId",
    component: ViewOrdersComponent
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
    path: "settings/dashboard",
    component: SettingsDasboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "settings/set-featured-products/pages/:pageNumber",
    component: FeaturedProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "settings/set-recommended-products/pages/:pageNumber",
    component: RecommendedProductComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "productInsight/add",
    component: AddProductComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "categoryInsight/add",
    component: AddCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "reset-password/:token",
    component: ResetPasswordComponent
  },
  { path: "", redirectTo: "adminDashboard", pathMatch: "full" },
  { path: "**", redirectTo: "adminDashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
