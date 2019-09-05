import {Observable, throwError as observableThrowError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/internal/operators';
import {environment} from '../../../environments/environment';
import { AbstractService } from './abstract.service';

@Injectable()
export class UserService extends AbstractService {
    progress: number;
    message: string;

    /**
     * 
     * @param data 
     * @param idNullValue 
     */
    save(data, idNullValue = -1): Observable<any> {
        if (data.Id != idNullValue)
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

    /**
     * 
     * @param data 
     */
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

    /**
     * 
     * @param id 
     */
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

    /**
     * 
     * @param idUser 
     * @param files 
     */
    upload(idUser: string, files) {
        if (files.length === 0)
          return;
    
        const formData = new FormData();
        formData.append(idUser, files[0]);
    
        const uploadReq = new HttpRequest('POST', `${environment.urlApiLocation}User/Upload`, formData, {
          reportProgress: true,
        });
    
        this.http.request(uploadReq).subscribe();
      }    
}
