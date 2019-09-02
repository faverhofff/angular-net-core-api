import {EventEmitter, Injectable} from '@angular/core';
import {AbstractService} from "../../core/services";

@Injectable({
    providedIn: 'root'
})
export class LoadingService extends AbstractService {

    public isLoading: EventEmitter<any> = new EventEmitter();

    setLoading (isLoading: boolean): void {
        this.isLoading.emit(isLoading);
    }

    /**
     * Start showing loading indicator
     */
    public start(): void {
        this.setLoading(true);
    }

    /**
     * Stop showing loading indicator
     */
    public stop(): void {
        this.setLoading(false);
    }
}
