import { Injectable } from '@angular/core';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AccessTokenService, AuthenticationService } from '../services';
import { AlertService } from '../../theme/components';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private authenticationService: AuthenticationService,
                private accessTokenService: AccessTokenService,
                private http: HttpClient,
                private alertService: AlertService
            ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(catchError(err => {
                if (err.status === 401 && !request.url.includes('api/login')) {
                    return of(<any>this.authenticationService.logout());
                }

            }));
    }

    // private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    //     if (request.url.includes('token/refresh')) {
    //         this.isRefreshingToken = false;
    //         return of(<any>this.authenticationService.logout());
    //     }

    //     if (!this.isRefreshingToken) {
    //         this.isRefreshingToken = true;
    //         this.tokenSubject.next(null);

    //         return this.authenticationService.refreshToken()
    //             .pipe(
    //                 switchMap(
    //                     (data: any) => {
    //                         if (data.token) {
    //                             AccessTokenService.saveToken(data.token);
    //                             this.tokenSubject.next(data.token);
    //                             return next.handle(JwtInterceptor.addAuthentication(request, this.accessTokenService.getToken()));
    //                         }

    //                         this.alertService.open(
    //                             'danger',
    //                             'Error',
    //                             'Expiró la sesión y no pudo ser recuperda.'
    //                         );
    //                         return of(<any>this.authenticationService.logout());
    //                     }
    //                 ),
    //                 catchError(err => {
    //                         this.authenticationService.logout();
    //                         return throwError(err.error);
    //                     }
    //                 ),
    //                 finalize(() => {
    //                         this.isRefreshingToken = false;
    //                     }
    //                 ));
    //     } else {
    //         this.isRefreshingToken = false;

    //         return this.tokenSubject
    //             .pipe(
    //                 filter(token => token != null),
    //                 take(1),
    //                 switchMap(token => {
    //                     return next.handle(JwtInterceptor.addAuthentication(request, this.accessTokenService.getToken()));
    //                 })
    //             );
    //     }
    // }

    // private formatErrors(error: HttpErrorResponse) {
    //     const alertableConfig = this.configService.getAlertableConfig();

    //     if (alertableConfig.show) {
    //         if (error.hasOwnProperty('error')) {
    //             if (error.error.hasOwnProperty('message')) {
    //                 this.alertService.open('danger', 'Error', error.error.message);
    //             }
    //         }
    //     }

    //     if (alertableConfig.flash) {
    //         this.configService.resetAlertableConfig();
    //     }
    // }
}

export let ErrorsInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};