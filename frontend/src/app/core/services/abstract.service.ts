import { Injectable } from '@angular/core';

import { Observable, throwError as observableThrowError, throwError } from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { AccessTokenService } from './access-token.service';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../theme/components/alerts/alert.service';

declare const $: any;

@Injectable()
export class AbstractService {

    jsonHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    constructor(protected http: HttpClient,
                protected alertService: AlertService,
                protected accessTokenService: AccessTokenService) {
    }

    protected handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error( 'An error occurred:', error.error.message );
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}` );
        }
        // return an observable with a user-facing error message
        return throwError( error );
    }

    protected uploadFile(path: string, body: Object = {}): Observable<any> {
        const headersConfig = {
            'Accept': 'application/json'
        };

        if (this.accessTokenService.getToken()) {
            headersConfig['Authorization'] = `Bearer ${this.accessTokenService.getToken()}`;
        }

        return this.http.post(`api${path}`, body, {headers: new HttpHeaders(headersConfig), reportProgress: true})
            .pipe(catchError(this.handleError.bind(this)));
    }

    /**
     * Create an observable to start a download.
     *
     * @param {string} url
     * @param {Partial<any>} params
     * @return {Observable<HttpResponse<Blob>>}
     */
    protected download(url: string, params: Partial<any> ): Observable<HttpResponse<Blob>> {
        const options = {};

        options['responseType'] = 'arraybuffer';
        options['headers'] = {
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': '*/*'
        };
        options['observe'] = 'response';

        return this.http.post<any>(url, $.param(params), options);
    }

    /**
     * Process the response from the download observer.
     *
     * @param {HttpResponse<Blob>} response
     */
    protected processResponse(response: HttpResponse<Blob>): void {
        let filename = "";
        const disposition = response.headers.get('content-disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }

        const type = response.headers.get('content-type');

        const blob = new Blob([response.body], {type: type});
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const URL = window.URL || window['webkitURL'];
            const downloadUrl = URL.createObjectURL(blob);

            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                const a = document.createElement("a");
                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window['location'] = downloadUrl;
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                }
            } else {
                window['location'] = downloadUrl;
            }

            setTimeout(function () {
                URL.revokeObjectURL(downloadUrl);
            }, 100); // cleanup
        }
    }
}
