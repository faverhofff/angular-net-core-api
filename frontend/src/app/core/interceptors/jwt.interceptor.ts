import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessTokenService } from '../services/access-token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private accessTokenService: AccessTokenService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(JwtInterceptor.addAuthentication(request, this.accessTokenService.getToken()));
    }

    static addAuthentication(request: HttpRequest<any>, token: string): HttpRequest<any> {
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer 2${token}`
                }
            });
        }
        return request;
    }

}

export let JWTInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
};