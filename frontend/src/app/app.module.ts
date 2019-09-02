import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import {NgBootstrapFormValidationModule} from "ng-bootstrap-form-validation";
import localeCL from '@angular/common/locales/es-CL'
import {registerLocaleData} from "@angular/common";

// App Modules
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './theme/theme.module';
import { UiModule } from './ui/ui.module';

import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { HomeComponent } from './pages/home/home.component';

registerLocaleData(localeCL);

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        NoopAnimationsModule, // This is needed instead of BrowserModule to support animations

        NgxPermissionsModule.forRoot(),

        // Core Modules
        ThemeModule.forRoot(),
        CoreModule.forRoot(),
        UiModule.forRoot(),

        NgBootstrapFormValidationModule.forRoot(),
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.circle,
            backdropBackgroundColour: '#1A577F',
            primaryColour: 'rgb(180,180,180)',
            secondaryColour: '#ffffff',
            tertiaryColour: '#1A577F'
        }),

        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: {
                popup: 'modal-content',
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn',
            },
        }),
        AppRoutingModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}