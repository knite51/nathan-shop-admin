import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { EndpointsService } from "../services/config/endpoints.service";
import { AuthService } from "./auth.service";
import { ActivatedRoute } from "@angular/router";
import { GeneralService } from "../services/general.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private genServ: GeneralService,
    private authServ: AuthService,
    private route: ActivatedRoute
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // console.log(err, "errror inter");

        let error;
        switch (err.status) {
          case 500:
            // auto logout if 401 response returned from api
            this.authServ.logout("unauthenticated");
            // this.genServ.expiredTokenUrl.subscribe(redirectUrl => {
            //   // console.log("res", redirectUrl);
            // });
            break;
          case 422:
            error = err.error;
            break;
          default:
            error = err.error.message ? err.error.message : "";
        }
        return throwError(error);
      })
    );
  }
}
