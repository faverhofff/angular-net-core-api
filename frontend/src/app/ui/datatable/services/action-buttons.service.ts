/**
 * Created by Indira Guerra on 6/21/2018.
 */
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class ActionButtonsService {
    public viewElement: EventEmitter<any> = new EventEmitter();
    public editElement: EventEmitter<any> = new EventEmitter();
    public deleteElement: EventEmitter<any> = new EventEmitter();
}
