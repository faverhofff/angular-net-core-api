import { Injectable } from '@angular/core';

@Injectable()
export class AccessTokenService {

    constructor(){
    }

    /**
     * 
     */
    getToken(): string {
        return window.localStorage['access_token'];
    }

    /**
     * 
     * @param token 
     */
    static saveToken(token: any) {
        window.localStorage['access_token'] = token;
    }

    /**
     * 
     */
    static destroyToken() {
        window.localStorage.removeItem( 'access_token' );
    }

}
