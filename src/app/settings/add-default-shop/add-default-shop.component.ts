import { Component, OnInit } from "@angular/core";
import { GeneralService } from "src/app/services/general.service";
import { EndpointsService } from "src/app/services/config/endpoints.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-default-shop",
  templateUrl: "./add-default-shop.component.html",
  styleUrls: ["./add-default-shop.component.css"]
})
export class AddDefaultShopComponent implements OnInit {
  defaultShopName = {
    name: ""
  };
  constructor(
    private genServ: GeneralService,
    private endpoints: EndpointsService,
    private route: Router,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {}

  private get shopDefaultDetails() {
    let validationFields = "";
    const obj = this.defaultShopName;

    for (const key in obj) {
      if (!obj[key]) {
        validationFields += `${key} cannot be blank <br/>`;
      }
    }
    return !validationFields ? { ...obj } : validationFields;
  }

  handleDefaultShopCreation() {
    const payload = this.shopDefaultDetails;
    if (typeof payload === "string") {
      this.genServ.sweetAlertHTML("Validation", payload);
    } else {
      const apiUrl = `${this.endpoints.defaultShopUrl.createGetUpdateDeleteDefaultShop}/add`;
      this.genServ.sweetAlertCreate("Default Shop").then(response => {
        if (response.value) {
          console.log(payload, "payoe");
          this.endpoints.create(apiUrl, payload).subscribe(
            (res: any) => {
              console.log(res, "response");
              this.genServ
                .sweetAlertSucess(
                  `Default Shop Created`,
                  `Default Shop has been added`
                )
                .then(res => {
                  // clear form fields
                  this.defaultShopName = {
                    name: ""
                  };
                });
            },
            error => {
              // console.log(error.error.non_field_errors[0], "lol");
              this.genServ.sweetAlertAuthVerification(
                `Error!! Default Shop could not be created`
              );
            }
          );
        }
      });
    }
  }

  backToPreviousPage() {
    this.route.navigate([this.router.snapshot.queryParams.redirectTo]);
  }
}
