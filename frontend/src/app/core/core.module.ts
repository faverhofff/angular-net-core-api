import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CookieService } from 'ngx-cookie-service';
import { CookieModule } from 'ngx-cookie';

import { AuthGuard } from './guards/auth.guard';
import { AccessTokenService, AuthenticationService, TransformService } from './services';
import { LoginComponent } from './pages/login/login.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import {RouterModule} from "@angular/router";
import { JWTInterceptor } from './interceptors/jwt.interceptor';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { RegisterComponent } from './pages/register/register.component';
import { ErrorsInterceptor } from './interceptors/error.interceptor';

export const CORE_PROVIDERS = [
    AuthGuard,
    AccessTokenService,
    AuthenticationService,
    CookieService,
    TransformService,
    ErrorsInterceptor,
    {provide: 'BASE_API_URL', useValue: '/api'},
    JWTInterceptor
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForbiddenComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,

        CookieModule.forRoot()
    ],
    exports: [
        LoginComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        RouterModule,
        NgxPermissionsModule,
    ],
    providers: [
        ...CORE_PROVIDERS
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CoreModule,
        };
    }
}
