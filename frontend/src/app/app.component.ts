import {Component} from '@angular/core';
import {LoadingService} from "./theme/services/loading.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'frontend';
    public loading = false;

    constructor(private loadingService: LoadingService) {
        this.loadingService.isLoading.subscribe(
            data => {
                this.loading = data;
            });
    }
}
