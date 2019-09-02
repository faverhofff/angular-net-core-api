import { ModuleWithProviders, NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import {
    AlertComponent, AlertService,
    SidebarComponent
} from './components';
import { BlankComponent, OuterToolbarComponent, SideNavOuterToolbarComponent } from './layouts';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const COMPONENTS = [
    BlankComponent,
    SideNavOuterToolbarComponent,
    OuterToolbarComponent,
    AlertComponent
];

const THEME_PROVIDERS = [
    AlertService
];

@NgModule({
    declarations: [
        HeaderComponent,
        SidebarComponent,
        BlankComponent,
        SideNavOuterToolbarComponent,
        OuterToolbarComponent,
        AlertComponent
    ],
    imports: [
        ...BASE_MODULES,
        NgxPermissionsModule.forChild()
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: ThemeModule,
            providers: [...THEME_PROVIDERS]
        };
    }
}
