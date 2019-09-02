import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AbstractService} from "../../core/services";
import {catchError} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class RolesService extends AbstractService {
    private apiUrl = `kernel/get/roles`;

    public getData(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}`)
            .pipe(catchError(this.handleError));
    }
}
