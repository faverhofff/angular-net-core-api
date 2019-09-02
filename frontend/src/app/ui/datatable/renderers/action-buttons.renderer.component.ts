/**
 * Created by Indira Guerra on 06/05/18.
 */

import {Component} from '@angular/core';
import {ActionButtonsService} from '../services/action-buttons.service';

declare var $: any;

@Component({
    template: ``
})
export class ActionButtonsRendererComponent {

    static formatValue(data, type, row, meta, id, view ?: true | false, eventsService ?: ActionButtonsService) {
        let html = '';

        // For models href reference
        if (view) {
            $('.btns-action')
                .on('click', 'i.viewElement.' + id, (e, t) => {
                    // const a = $(e.currentTarget);
                    // console.log('.btns-action viewElement id ', id);
                    if (eventsService) {
                        eventsService.viewElement.emit(row);
                    }
                })
                .on('click', 'i.editElement.' + id, (e, t) => {
                    // const a = $(e.currentTarget);
                    // console.log('.btns-action editElement id ', id);
                    if (eventsService) {
                        eventsService.editElement.emit(row);
                    }
                })
                .on('click', 'i.deleteElement.' + id, (e, t) => {
                    // const a = $(e.currentTarget);
                    // console.log('.btns-action deleteElement id ', id);
                    if (eventsService) {
                        eventsService.deleteElement.emit(row);
                    }
                });

            html = `
                        <div class="btns-action">
                            <i class="fa fa-eye fa-lg viewElement ` + id + `"
                                data-toggle="tooltip" data-placement="bottom" title="View"></i>
                            <i class="fa fa-edit fa-lg editElement ` + id + `"
                                data-toggle="tooltip" data-placement="bottom" title="Edit"></i>
                            <i class="fa fa-trash fa-lg deleteElement ` + id + `"
                                data-toggle="tooltip" data-placement="bottom" title="Delete"></i>
                        </div>
                        `;
        } else {
            $('.btns-action')
                .on('click', 'i.editElement.' + id, (e, t) => {
                    // const a = $(e.currentTarget);
                    // console.log('.btns-action editElement id ', id);
                    if (eventsService) {
                        eventsService.editElement.emit(row);
                    }
                })
                .on('click', 'i.deleteElement.' + id, (e, t) => {
                    // const a = $(e.currentTarget);
                    // console.log('.btns-action deleteElement id ', id);
                    if (eventsService) {
                        eventsService.deleteElement.emit(row);
                    }
                });

            html = `
                        <div class="btns-action">
                            <i class="fa fa-edit fa-lg editElement ` + id + `"
                                data-toggle="tooltip" data-placement="bottom" title="Edit"></i>
                            <i class="fa fa-trash fa-lg deleteElement ` + id + `"
                                data-toggle="tooltip" data-placement="bottom" title="Delete"></i>
                        </div>
                        `;
        }

        return html;
    }

}
