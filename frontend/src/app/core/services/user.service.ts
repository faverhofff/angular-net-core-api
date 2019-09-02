import {Observable, throwError as observableThrowError, empty} from 'rxjs';
import {Injectable} from '@angular/core';

import {AccessTokenService} from './access-token.service';
import {HttpClient, HttpHeaders, HttpRequest, HttpEventType} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, map} from 'rxjs/internal/operators';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../../environments/environment';
import { User } from '../models/user';
import { LoginForm } from '../models/login.form';
import { AbstractService } from './abstract.service';

@Injectable()
export class UserService extends AbstractService {
    progress: number;
    message: string;

    /**
     * 
     * @param data 
     */
    save(data): Observable<any> {
        if (data.Id)
            return this.update(data);
        else
            return this.create(data);
    }

    /**
     * 
     * @param formValues 
     */
    create(data): Observable<any> {
        return this.http.post(
            `${environment.urlApiLocation}User`,
            JSON.stringify(data),
            {headers: this.jsonHeaders})
        .pipe(
            map((res) => {
                if (res['succeeded']===true) {
                    return {status: 'OK'};
                } else
                    return {status: res['errors']};
            }),
            catchError((error: any) => observableThrowError(error || 'Server error')));
    }

    update(data): Observable<any> {
        return this.http.put(
            `${environment.urlApiLocation}User`,
            JSON.stringify(data),
            {headers: this.jsonHeaders})
        .pipe(
            map((res) => {
                if (res['succeeded']===true) {
                    return {status: 'OK'};
                } else
                    return {status: 'ERROR'};
            }),
            catchError((error: any) => observableThrowError(error || 'Server error')));
    }

    delete(id: any): Observable<any> {
        return this.http.delete(
            `${environment.urlApiLocation}User/${id}`,
            {headers: this.jsonHeaders})
        .pipe(
            map((res) => {
                if (res['token']) {
                    return {status: 'OK'};
                } else
                    return {status: 'ERROR'};
            }),
            catchError((error: any) => observableThrowError(error || 'Server error')));
    }

    upload(files) {
        if (files.length === 0)
          return;
    
        const formData = new FormData();
    
        for (let file of files)
          formData.append(file.name, file);
    
        const uploadReq = new HttpRequest('POST', `api/upload`, formData, {
          reportProgress: true,
        });
    
        this.http.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response)
            this.message = event.body.toString();
        });
      }    
}
