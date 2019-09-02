import {AfterViewInit, Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {DatatableNetComponent} from "../datatable.net.component";

declare const $: any;

@Directive({
    selector: '[appDatatableButtons]'
})
/**
 * Directive to render datatable buttons using the existing datatable buttons plugin.
 *
 * Expected config is the same as used in the datatable plugin.
 */
export class DatatableButtonsDirective implements AfterViewInit, OnDestroy {

    @Input('appDatatableButtons')
    /**
     * Expected config is:
     *  datatable: an existing DatatableNetComponent
     *  buttons: (optional) same configuration used by datatable buttons plugin.
     */
    public config: {
        datatable: DatatableNetComponent,
        buttons?: any
    };

    constructor(
        protected el: ElementRef
    ) {
    }

    ngAfterViewInit(): void {
        this.createButtons();
    }

    ngOnDestroy(): void {

        // Detach destroy handler on datatable element
        if ($.fn.dataTable.Buttons) {
            if (this.config.datatable) {
                this.config.datatable.getTable().dtInstance.then((dtInstance: DataTables.Api) => {
                    $(dtInstance.table('table').node()).off('destroy.dt');
                });
            }
        }
    }

    /**
     * Render the buttons on the dom and configures a handler to destroy them when datatable is destroyed.
     */
    protected createButtons(): void {
        if ($.fn.dataTable.Buttons) {
            if (this.config.datatable) {
                this.config.datatable.getTable().dtInstance.then((dtInstance: DataTables.Api) => {
                    let config = {
                        dom: {
                            button: {
                                className: ''
                            }
                        }
                    };

                    if (this.config.buttons) {
                        if (this.config.buttons.buttons) {
                            Object.assign(config, this.config.buttons);
                        } else {
                            config['buttons'] = this.config.buttons;
                        }
                    }

                    const buttons = new $.fn.dataTable.Buttons( dtInstance, config);

                    $(dtInstance.table('table').node()).on('destroy.dt', () => {
                        buttons.destroy();
                    });

                    buttons.container().appendTo($(this.el.nativeElement));
                });
            }
        }
    }

}
