import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatNativeDateModule,
  DateAdapter,
  MAT_DATE_FORMATS
} from "@angular/material";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeaderNavComponent } from "./header-nav/header-nav.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { ViewProductComponent } from "./products/view-product/view-product.component";
import { ListProductComponent } from "./products/list-product/list-product.component";
import { ShortenPipe } from "./shared/pipes/shorten.pipe";
import { FilterPipe } from "./shared/pipes/filter.pipe";
// import { ListShopComponent } from "./shops/list-shop/list-shop.component";
// import { AddShopComponent } from "./shops/add-shop/add-shop.component";
// import { ViewShopComponent } from "./shops/view-shop/view-shop.component";
import { LoginComponent } from "./auth/login/login.component";
import { AuthcrudInterceptorService } from "./auth/auth-crud-interceptor.service";
import { AddDefaultShopComponent } from "./settings/add-default-shop/add-default-shop.component";
import { ListDefaultShopComponent } from "./settings/list-default-shop/list-default-shop.component";
import { ViewDefaultShopComponent } from "./settings/view-default-shop/view-default-shop.component";
import { AddAdminComponent } from "./admins/add-admin/add-admin.component";
import { ListAdminComponent } from "./admins/list-admin/list-admin.component";
import { AssignViewAdminComponent } from "./admins/assign-view-admin/assign-view-admin.component";
import { StringifyArray } from "./shared/pipes/stringifyArray.pipe";
import { ProductCategoryDashboardComponent } from "./products/product-category-dashboard/product-category-dashboard.component";
import { AddCategoryComponent } from "./products/add-category/add-category.component";
import { ListCategoryComponent } from "./products/list-category/list-category.component";
import { ViewCategoryComponent } from "./products/view-category/view-category.component";
import { ListOrdersComponent } from "./orders/list-orders/list-orders.component";
import { ViewOrdersComponent } from "./orders/view-orders/view-orders.component";
import { ErrorInterceptor } from "./auth/auth-err-interceptor.service";
import { SettingsDasboardComponent } from "./settings/settings-dasboard/settings-dasboard.component";
import { SetPaymentComponent } from "./settings/payments/set-payment/set-payment.component";
import { UserProfileComponent } from "./admins/user-profile/user-profile.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderNavComponent,
    SidebarComponent,
    AddProductComponent,
    ViewProductComponent,
    ListProductComponent,
    ShortenPipe,
    FilterPipe,
    StringifyArray,
    // ListShopComponent,
    // AddShopComponent,
    // ViewShopComponent,
    LoginComponent,
    AddDefaultShopComponent,
    ListDefaultShopComponent,
    ViewDefaultShopComponent,
    AddAdminComponent,
    ListAdminComponent,
    AssignViewAdminComponent,
    ProductCategoryDashboardComponent,
    AddCategoryComponent,
    ListCategoryComponent,
    ViewCategoryComponent,
    ListOrdersComponent,
    ViewOrdersComponent,
    SettingsDasboardComponent,
    SetPaymentComponent,
    UserProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,

    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatMenuModule,
    MatDatepickerModule,

    MatNativeDateModule,
    MatCardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthcrudInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
