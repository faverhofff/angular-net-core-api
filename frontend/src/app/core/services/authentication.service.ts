import {Observable, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';

import {AccessTokenService} from './access-token.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/internal/operators';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../../environments/environment';
import { User } from '../models/user';
import { LoginForm } from '../models/login.form';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient,
                private accessTokenService: AccessTokenService
    ) { }

    /**
     * 
     */
    isLogin(): boolean {
        return !!this.accessTokenService.getToken();
    }

    /**
     * 
     */
    static getUser(): User {
        try {
            return User.make(JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('user'), environment.encryptKey).toString(CryptoJS.enc.Utf8)));
        } catch (e) {
            return User.make();
        }
    }

    static setUser(user: User): void {
        const output = CryptoJS.AES.encrypt(JSON.stringify(user), environment.encryptKey).toString();
        localStorage.setItem('user', output);
    }

    /**
     * 
     */
    destroyCache() {
        localStorage.removeItem('user');
    }

    /**
     * 
     * @param formValues 
     */
    login(email: string, password: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post(
            `${environment.urlApiLocation}Auth/Login`,
            JSON.stringify({Email: email, Password: password}),
            {headers: headers})
        .pipe(
            map((res) => {
                if (res['token']) {
                    AccessTokenService.saveToken(res['token']);
                    AuthenticationService.setUser(res['user']);
                    return {status: 'OK'};
                } else
                    return {status: 'ERROR'};
            }),
            catchError((error: any) => observableThrowError(error || 'Server error')));
    }

    /**
     * 
     * @param email 
     * @param password 
     */
    register(email: string, password: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post(
            `${environment.urlApiLocation}Auth/Register`,
            JSON.stringify({Email: email, Password: password}),
            {headers: headers})
        .pipe(
            map((res) => {
                return {errors: res['errors'], succeeded: res['succeeded']};
            }),
            catchError((error: any) => observableThrowError(error || 'Server error')));
    }

    /**
     * 
     */
    logout(): void {
        AccessTokenService.destroyToken();
        this.destroyCache();
    }

}
