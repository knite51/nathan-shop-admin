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

import { LoginComponent } from "./auth/login/login.component";
import { AuthcrudInterceptorService } from "./auth/auth-crud-interceptor.service";
import { AddAdminComponent } from "./admins/add-admin/add-admin.component";
import { ListAdminComponent } from "./admins/list-admin/list-admin.component";
import { StringifyArray } from "./shared/pipes/stringifyArray.pipe";
import { ProductCategoryDashboardComponent } from "./products/product-category-dashboard/product-category-dashboard.component";
import { AddCategoryComponent } from "./products/add-category/add-category.component";
import { ListCategoryComponent } from "./products/list-category/list-category.component";
import { ViewCategoryComponent } from "./products/view-category/view-category.component";
import { ErrorInterceptor } from "./auth/auth-err-interceptor.service";
import { UserProfileComponent } from "./admins/user-profile/user-profile.component";
import { ViewAdminComponent } from "./admins/view-admin/view-admin.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { ListOrdersComponent } from "./orders/list-orders/list-orders.component";
import { ViewOrdersComponent } from "./orders/view-orders/view-orders.component";
import { DashboardTablesComponent } from "./dashboard/dashboard-tables/dashboard-tables.component";

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
    LoginComponent,
    AddAdminComponent,
    ListAdminComponent,
    ProductCategoryDashboardComponent,
    AddCategoryComponent,
    ListCategoryComponent,
    ViewCategoryComponent,
    UserProfileComponent,
    ViewAdminComponent,
    ResetPasswordComponent,
    ListOrdersComponent,
    ViewOrdersComponent,
    DashboardTablesComponent
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
