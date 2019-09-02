/**
 * Created by Indira Guerra on 06/05/18.
 */

import {Component} from '@angular/core';

declare var $: any;

/**
 * Buttons Renderer Component Settings Type
 */
export type ButtonsRendererSettings = {
    row: any,
    idParam?: number|string,
    objParam?: boolean,
    buttons?: Array<ButtonsRendererButtonsEnum>
}

/**
 * Supported buttons
 */
export enum ButtonsRendererButtonsEnum {
    VIEW = 'view',
    EDIT = 'edit',
    REMOVE = 'remove',
    UP = 'up',
    DOWN = 'down',
    EXCEL = 'excel',
    PDF = 'pdf',
    LOCK = 'lock',
    ADD = 'add',
    HISTORY = 'history',
}

@Component({
    template: ``
})
export class ButtonsRendererComponent {

    static checkbox(value: string, name?: string, className?: string, checked = false) {
        let html = `<div class="btns-action align-middle">`;
        html += `<input type="checkbox" class="${className}" name="${name}" value="${value}" ${ checked ? 'checked':''} />`;
        html+=`</div>`;
        return html;
    }

    static switch(id: any, value: any, value_marked = [], disabled?: boolean, data?: object[]) {
        let realValue = null; 
        let strData = "";
        let disabledT = disabled ? ' disabled ' : '';
        
        value_marked.forEach( (element) => {
            if (element==value && realValue == null)
                realValue = ' checked ';
        }); 

        if (data != undefined && data.hasOwnProperty('length') && data.length>0) {
            data.forEach( (element) => { 
                strData += `data-${Object.keys(element)}=${Object.values(element)} `;
            });
        }
        
        let html = `<div>
            <label class="switch">
                <input class="form-control selector-array" type="checkbox" data-id="${id}" ${realValue} ${strData} ${disabledT} />
                <span class="slider round"></span>
            </label>
        </div>`;
        return html;
    }

    /**
     * Render html markup of buttons group.
     *
     * @param row
     * @param id
     * @param {boolean} view
     * @param {boolean} edit
     * @param {boolean} remove
     * @param {boolean} idParam
     * @param {boolean} objParam
     * @param {boolean} up
     * @param {boolean} down
     * @return {string}
     *
     * @deprecated
     */
    static formatValue(row,
                       id,
                       view ?: boolean,
                       edit ?: boolean,
                       remove ?: boolean,
                       idParam?: boolean,
                       objParam?: boolean,
                       up?: boolean,
                       down?: boolean): string;
    /**
     * Render html markup of group of buttons.
     *
     * @param {ButtonsRendererSettings} settings
     * @return {string}
     */
    static formatValue(settings: ButtonsRendererSettings): string;
    static formatValue(settings: ButtonsRendererSettings): string {

        let _settings = settings;

        if (arguments.length > 1) {
            //Transform old format to new one
            let _settingsBuilding: ButtonsRendererSettings = {
                row: null
            };
            let _buttons = [];

            if (arguments.propertyIsEnumerable(0)) {
                _settingsBuilding.row = arguments[0];
            }

            if (arguments.propertyIsEnumerable(1)) {
                _settingsBuilding.idParam = arguments[1];
            }

            if (arguments.propertyIsEnumerable(2)) {
                if (arguments[2]) {
                    _buttons.push(ButtonsRendererButtonsEnum.VIEW);
                }
            }

            if (arguments.propertyIsEnumerable(3)) {
                if (arguments[3]) {
                    _buttons.push(ButtonsRendererButtonsEnum.EDIT);
                }
            }

            if (arguments.propertyIsEnumerable(4)) {
                if (arguments[4]) {
                    _buttons.push(ButtonsRendererButtonsEnum.REMOVE);
                }
            }

            if (arguments.propertyIsEnumerable(5)) {
                if (arguments[5] === false) {
                    _settingsBuilding.idParam = '';
                }
            }

            if (arguments.propertyIsEnumerable(6)) {
                _settingsBuilding.objParam = arguments[6];
            }

            if (arguments.propertyIsEnumerable(7)) {
                if (arguments[7]) {
                    _buttons.push(ButtonsRendererButtonsEnum.UP);
                }
            }

            if (arguments.propertyIsEnumerable(8)) {
                if (arguments[8]) {
                    _buttons.push(ButtonsRendererButtonsEnum.DOWN);
                }
            }

            _settingsBuilding.buttons = _buttons;

            _settings = _settingsBuilding;
        }

        let rowJson = '';

        if (settings.objParam) {
            rowJson = encodeURIComponent(JSON.stringify(_settings.row));
        }

        let html = `<div class="btns-action align-middle">`;

        for (let button of _settings.buttons) {
            switch (button) {
                case ButtonsRendererButtonsEnum.VIEW:
                    html += `<i class="btn btn-blue outline-box-none icon icon-icon-1 mr-2 align-middle c-poiter viewElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Ver">Ver</i>`;
                    break;

                case ButtonsRendererButtonsEnum.EDIT:
                    html += `<i class="btn btn-blue outline-box-none icon icon-edit-item mr-2 align-middle c-poiter editElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Editar">Editar</i>`;
                    break;

                case ButtonsRendererButtonsEnum.REMOVE:
                    html += `<i class="btn btn-blue outline-box-none icon icon-delete mr-2 align-middle c-poiter deleteElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Eliminar">Eliminar</i>`;
                    break;

                case ButtonsRendererButtonsEnum.UP:
                    html += `<i class="btn btn-blue outline-box-none icon icon-up fa-xl mr-2 align-middle c-poiter upElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Subir"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.DOWN:
                    html += `<i class="icon icon-down fa-xl mr-2 align-middle c-poiter downElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Bajar"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.EXCEL:
                    html += `<i class="icon icon-exportar-excel fa-xl mr-2 align-middle c-poiter excelExportElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Exportar a Excel"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.PDF:
                    html += `<i class="icon icon-pdf fa-xl mr-2 align-middle c-poiter pdfExportElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Exportar a Pdf"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.LOCK:
                    html += `<i class="icon icon-lock fa-xl mr-2 align-middle c-poiter text-gray lockElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Cerrado"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.ADD:
                    html += `<i class="icon icon-add fa-xl mr-2 align-middle c-poiter addElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Adicionar"></i>`;
                    break;

                case ButtonsRendererButtonsEnum.HISTORY:
                    html += `<i class="icon fa fa-history fa-xl mr-2 align-middle c-poiter historyElement" 
                                data-id="${_settings.idParam || ''}"
                                data-row="${rowJson}"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Historial"></i>`;
                    break;
            }
        }

        html += `</div>`;

        return html;

    }
}
