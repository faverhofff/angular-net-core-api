import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ActionButtonsService } from './datatable/services/action-buttons.service';
import { DatatableNetComponent } from './datatable/datatable.net.component';
import { ActionButtonsRendererComponent } from './datatable/renderers/action-buttons.renderer.component';
import { ButtonsRendererComponent } from './datatable/renderers/buttons.renderer.component';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableButtonsDirective } from './datatable/directives/datatable-buttons.directive';
import { extendDatatableButtons } from "./datatable/helpers/helpers";
import { DatatableButtonsService } from "./datatable/services/datatable-buttons.service";
import { DatatableOfflineNetComponent } from "./datatable/datatable-offline.net.component";
import {NgBootstrapFormValidationModule} from "ng-bootstrap-form-validation";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import { MyDatePickerModule } from 'mydatepicker';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const UI_PROVIDERS = [
    ActionButtonsService,
    {
        provide: APP_INITIALIZER,
        useFactory: extendDatatableButtons,
        deps: [DatatableButtonsService],
        multi: true
    }
];

@NgModule({
    declarations: [
        DatatableNetComponent,
        ActionButtonsRendererComponent,
        ButtonsRendererComponent,
        DatatableButtonsDirective,
        DatatableOfflineNetComponent
    ],
    imports: [
        ...BASE_MODULES,
        SweetAlert2Module,
        DataTablesModule,
        MyDatePickerModule
    ],
    exports: [
        DatatableNetComponent,
        DatatableOfflineNetComponent,
        ActionButtonsRendererComponent,
        ButtonsRendererComponent,
        DatatableButtonsDirective,
        SweetAlert2Module,
        NgBootstrapFormValidationModule,
        DataTablesModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MyDatePickerModule
    ],
})
export class UiModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: UiModule,
            providers: [...UI_PROVIDERS]
        };
    }
}
