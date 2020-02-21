import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class EndpointsService {
  private host = environment.apiUrl;
  public httpStatus = "allCalls";

  public adminUsersUrl = {
    createGetUpdateDeleteAdmin: "shop/admin",
    assignToShop: "admin/assign_to_shop",
    unassignToShop: "admin/unassign"
  };

  public dashboardUrl = {
    report: "shop/dashboard"
  };

  public userProfileUrl = {
    getUpdate: "shop/profile",
    changePassword: "shop/password/change"
  };

  public adminCategoryUrl = {
    createGetUpdateDeleteAdminCategory: "category"
  };

  public productsUrl = {
    createGetUpdateDeleteProducts: "products",
    uploadProductBulk: "products/import",
    featuredProduct: "shop/theme/featured_products",
    recommendedProduct: "shop/theme/recommended_products"
  };

  public categoriesUrl = {
    getUpdateCategoryByShops: "category",
    deleteCategory: "category/delete"
  };

  public ordersUrl = {
    getViewOrders: "shop/orders",
    searchOrders: "shop/orders/search?",
    getPending: "shop/orders/list?status=pending",
    completed: "shop/orders/list?status=completed"
  };

  public customersUrl = {
    createGetUpdateDeleteCustomers: "customers"
  };

  public registerLoginUrl = {
    loginShopAdmin: "shop/login",
    register: "staff/signup/",
    resetPassword: "shop/password/reset/request",
    changePassword: "shop/password/update"
  };

  constructor(private http: HttpClient) {}

  create(apiUrl, credentials, image?) {
    image ? (this.httpStatus = "createProductImage") : "allCalls";
    try {
      return this.http.post(`${this.host}${apiUrl}`, credentials);
    } catch (error) {
      alert(error);
    }
  }

  fetch(apiUrl) {
    try {
      return this.http.get(`${this.host}${apiUrl}`);
    } catch (error) {
      alert(error);
    }
  }

  update(apiUrl, payload) {
    try {
      return this.http.put(`${this.host}${apiUrl}`, payload);
    } catch (error) {
      alert(error);
    }
  }

  updateWithPatch(apiUrl, payload) {
    try {
      return this.http.patch(`${this.host}${apiUrl}`, payload);
    } catch (error) {
      alert(error);
    }
  }

  filter(apiUrl, params) {
    try {
      return this.http.get(`${this.host}${apiUrl}${params}`);
    } catch (error) {
      alert(error);
    }
  }

  // Paginating
  fetchPaginationPage(url) {
    try {
      return this.http.get(url);
    } catch (error) {
      alert(error);
    }
  }

  delete(apiUrl, selector) {
    try {
      return this.http.delete(`${this.host}${apiUrl}/${selector}`);
    } catch (error) {
      alert(error);
    }
  }

  // Login and Register
  loginUser(apiUrl, credentials) {
    this.httpStatus = "login";
    try {
      return this.http.post(`${this.host}${apiUrl}`, credentials);
    } catch (error) {
      alert(error);
    }
  }

  registerUser(credentials) {
    this.httpStatus = "login";
    try {
      return this.http.post(
        `${this.host}${this.registerLoginUrl.register}`,
        credentials
      );
    } catch (error) {
      alert(error);
    }
  }
}
