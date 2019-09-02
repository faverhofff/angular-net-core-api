import {DatatableButtonsService} from "../services/datatable-buttons.service";

/**
 * Extend the datatable buttons plugin by changing behaviour in its buttons to use DatatableButtonService to
 * download the documents.
 *
 * This function is intended to be used only on App init.
 *
 * @param {DatatableButtonsService} service
 * @return {() => void}
 */
export function extendDatatableButtons(service: DatatableButtonsService) {
    return () => {
        const DataTable = jQuery.fn.dataTable;

        DataTable.ext['buttons'].excel = {
            className: 'buttons-excel',

            text: function (dt) {
                return '<i class="fa fa-file-excel-o"></i> ' + dt.i18n('buttons.excel', 'Excel');
            },

            action: function (e, dt, button, config) {
                service.execute(e, dt, button, config, 'excel');
            }
        };

        DataTable.ext['buttons'].export = {
            extend: 'collection',

            className: 'buttons-export',

            text: function (dt) {
                return '<i class="fa fa-download"></i> ' + dt.i18n('buttons.export', 'Export') + '&nbsp;<span class="caret"/>';
            },

            buttons: ['csv', 'excel', 'pdf']
        };

        DataTable.ext['buttons'].csv = {
            className: 'buttons-csv',

            text: function (dt) {
                return '<i class="fa fa-file-excel-o"></i> ' + dt.i18n('buttons.csv', 'CSV');
            },

            action: function (e, dt, button, config) {
                service.execute(e, dt, button, config, 'csv');
            }
        };

        DataTable.ext['buttons'].pdf = {
            className: 'buttons-pdf',

            text: function (dt) {
                return '<i class="fa fa-file-pdf-o"></i> ' + dt.i18n('buttons.pdf', 'PDF');
            },

            action: function (e, dt, button, config) {
                service.execute(e, dt, button, config, 'pdf');
            }
        };

        DataTable.ext['buttons'].print = {
            className: 'buttons-print',

            text: function (dt) {
                return  '<i class="fa fa-print"></i> ' + dt.i18n('buttons.print', 'Print');
            },

            action: function (e, dt, button, config) {
                service.execute(e, dt, button, config, 'print');
            }
        };

        DataTable.ext['buttons'].reset = {
            className: 'buttons-reset',

            text: function (dt) {
                return '<i class="fa fa-undo"></i> ' + dt.i18n('buttons.reset', 'Reset');
            },

            action: function (e, dt, button, config) {
                dt.search('');
                dt.columns().search('');
                dt.draw();
            }
        };

        DataTable.ext['buttons'].reload = {
            className: 'buttons-reload',

            text: function (dt) {
                return '<i class="fa fa-refresh"></i> ' + dt.i18n('buttons.reload', 'Reload');
            },

            action: function (e, dt, button, config) {
                dt.draw(false);
            }
        };

        if (typeof DataTable.ext['buttons'].copyHtml5 !== 'undefined') {
            $.extend(DataTable.ext['buttons'].copyHtml5, {
                text: function (dt) {
                    return '<i class="fa fa-copy"></i> ' + dt.i18n('buttons.copy', 'Copy');
                }
            });
        }

        if (typeof DataTable.ext['buttons'].colvis !== 'undefined') {
            $.extend(DataTable.ext['buttons'].colvis, {
                text: function (dt) {
                    return '<i class="fa fa-eye"></i> ' + dt.i18n('buttons.colvis', 'Column visibility');
                }
            });
        }
    };
}