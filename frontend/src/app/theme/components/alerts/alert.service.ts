/**
 * Created by Indira Guerra on 08/06/2018.
 */

import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AlertService {
    public ready: EventEmitter<any> = new EventEmitter();

    getReady(): EventEmitter<any> {
        return this.ready;
    }

    open(typeT: string, titleT: string, contentT: string): void {
        this.ready.emit({type: typeT, title: titleT, content: contentT});
    }
}
