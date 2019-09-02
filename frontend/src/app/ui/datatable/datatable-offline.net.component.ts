import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';

declare var $: any;

const datatableEmptyResponse = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: '',
};

@Component({
    selector: 'app-datatable-net-offline',
    templateUrl: './datatable.net.template.html'
})
export class DatatableOfflineNetComponent implements OnInit, AfterViewInit, OnDestroy {

    /* To render datatable */
    public data: Array<any> = [];

    // Table settings customized
    @Input() tableSettings;

    // On row selected
    @Output() rowSelected: EventEmitter<any> = new EventEmitter();

    // Loading data
    @Output() isLoadingData: EventEmitter<any> = new EventEmitter();

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // dtOptions: DataTables.Settings = {};
    dtOptions = {};

    dtTrigger: Subject<any> = new Subject();

    public destroy = false;


    settings = {
        data: [],  // Povisional until api integration(Change to "apiUrl: ''")
        class: '',
        columns: {},
        /**
         * Ex:. (* means not required)
         * [
         *    // tr1 definition
         *    {
         *        *className : "mi-tr1-class-name",
         *
         *        // th definitions
         *        children : [
         *            {title: "Mi title 1", *colspan: 5, *rowspan: 3, *className: "mi-td1-class-name"},
         *            {title: "Mi title 2", *colspan: 5, *rowspan: 3, *className: "mi-td2-class-name"},
         *            {title: "Mi title 3", *colspan: 5, *rowspan: 3, *className: "mi-td3-class-name"},
         *        ]
         *    },
         *
         *    // tr2 definition
         *    {
         *        *className : "mi-tr2-class-name",
         *
         *        // th definitions
         *        children : [
         *            {title: "Mi title 1", *colspan: 5, *rowspan: 3, *className: "mi-td1-class-name"},
         *            {title: "Mi title 2", *colspan: 5, *rowspan: 3, *className: "mi-td2-class-name"},
         *        ]
         *    }
         *
         * ]
         */
        columnsHtml: [],
        length: 12,
        searching: false,
        processing: false,
        serverSide: false,
        language: {
            url: '/assets/i18n/dt_en.json'
        },
        responsive: true,
        select: false,
        autoWidth: true,
        aoColumns: {},
        buttons: [],
        dom: 'Blfrtip',
    };

    url = '';

    searchData: any;

    //Inline editing of DataTable making use of jebeauty cell edit plugin.
    // E.g.
    // {
    //     "onUpdate": myCallbackFunction,
    //     "inputCss":'my-input-class',
    //     "columns": [0,1,2],
    //     "allowNulls": {
    //         "columns": [1],
    //         "errorClass": 'error'
    //     },
    //     "confirmationButton": {
    //         "confirmCss": 'my-confirm-class',
    //         "cancelCss": 'my-cancel-class'
    //     },
    //     "inputTypes": [
    //         {
    //             "column":0,
    //             "type":"text",
    //             "options":null
    //         },
    //         {
    //             "column":1,
    //             "type": "list",
    //             "options":[
    //                 { "value": "1", "display": "Beaty" },
    //                 { "value": "2", "display": "Doe" },
    //                 { "value": "3", "display": "Dirt" }
    //             ]
    //         }
    //         ,{
    //             "column": 2,
    //             "type": "datepicker", // requires jQuery UI: http://http://jqueryui.com/download/
    //             "options": {
    //                 "icon": "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif" // Optional
    //             }
    //         }
    //     ]
    // };

    @Input()
    public inlineEditingSettings = {
        'onUpdate': () => {
            alert('First, tell me what to do when inline editing!');
        },
    };

    /* Set to true to start inline editing */
    @Input()
    public useInlineEditing = false;

    public constructor(private el: ElementRef,
                       private http: HttpClient) {
    }

    public ngOnInit(): any {

        // For language initialization
        if (window.localStorage['lang']) {
            switch (window.localStorage['lang']) {
                case 'fr':
                    this.settings.language.url = '/assets/i18n/dt_fr.json';
                    break;
                case 'en':
                default:
                    this.settings.language.url = '/assets/i18n/dt_en.json';
            }
        }
        this.dtInitialization();
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
        if (this.tableSettings && this.tableSettings.hasOwnProperty('initComplete')) {
            this.tableSettings['initComplete'] = () => {
            };
        }
    }

    rerender(): void {
        this.dtInitialization();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }

    public dtInitialization(): void {
        // Essentially refreshes the table
        // if (this.tableWidget) {
        //     this.tableWidget.destroy();
        //     // you can also remove all rows and add new
        //     // this.tableWidget.clear().rows.add(this.shipments).draw();
        // }

        //AutoWidth
        if (this.tableSettings.hasOwnProperty('autoWidth')) {
            this.settings['autoWidth'] = this.tableSettings.autoWidth;
        }

        // Change basic configuration
        if (this.tableSettings.class) {
            this.settings.class = this.tableSettings.class;
        }

        if (this.tableSettings.data) {
            this.settings.data = this.tableSettings.data;
        }

        // if (this.tableSettings.pager) {
        //     this.settings.length = this.tableSettings.length;
        // }
        if (this.tableSettings.columns) {
            this.settings.columns = this.tableSettings.columns;
            this.settings.aoColumns = this.tableSettings.columns;
        } else if (this.tableSettings.columnsHtml.length) {
            this.settings.columnsHtml = this.tableSettings.columnsHtml;
        }

        if (this.tableSettings.select) {
            const self = this;
            this.settings.select = this.tableSettings.select;
            this.settings['rowCallback'] = function (row: Node, data: any[] | Object, index: number) {
                if (self.settings.select.hasOwnProperty('selector')) {
                    $(self.settings.select['selector'], row).unbind('click');
                    $(self.settings.select['selector'], row).bind('click', () => {
                        let selected = $(row).hasClass('selected');
                        self.rowSelected.emit({data: data, index: index, selected: !selected});
                    });
                } else {
                    $('td', row).unbind('click');
                    $('td', row).bind('click', () => {
                        let selected = $(row).hasClass('selected');
                        self.rowSelected.emit({data: data, index: index, selected: !selected});
                    });
                }
            };
        }
        if (this.tableSettings.fnDrawCallback) {
            this.settings['fnDrawCallback'] = this.tableSettings.fnDrawCallback;
        }
        if (this.tableSettings.responsive) {
            this.settings.responsive = this.tableSettings.responsive;
        }
        if (this.tableSettings.searching) {
            this.settings.searching = this.tableSettings.searching;
        }

        this.settings.aoColumns = this.tableSettings.columns;

        if (this.tableSettings.fixedColumn) {
            this.settings.responsive = false;
            this.settings['ordering'] = false;

            if (this.tableSettings.fixedColumn.scrollY)
                this.settings['scrollY'] = this.tableSettings.fixedColumn.scrollY;

            if (this.tableSettings.fixedColumn.scrollX)
                this.settings['scrollX'] = this.tableSettings.fixedColumn.scrollX;

            if (this.tableSettings.fixedColumn.scrollCollapse)
                this.settings['scrollCollapse'] = this.tableSettings.fixedColumn.scrollCollapse;

            if (this.tableSettings.fixedColumn.fixedColumns)
                this.settings['fixedColumns'] = this.tableSettings.fixedColumn.fixedColumns;

            if (this.tableSettings.fixedColumn.fixedColumns.leftColumns)
                this.settings['fixedColumns']['leftColumns'] = this.tableSettings.fixedColumn.fixedColumns.leftColumns;

            if (this.tableSettings.fixedColumn.fixedColumns.rightColumns)
                this.settings['fixedColumns']['rightColumns'] = this.tableSettings.fixedColumn.fixedColumns.rightColumns;
        }

        // Disable initial automatic ajax call
        if (this.tableSettings.hasOwnProperty('deferLoading')) {
            this.settings['deferLoading'] = this.tableSettings.deferLoading;
        }

        if (this.useInlineEditing) {
            const self = this;
            if (this.tableSettings.hasOwnProperty('initComplete')) {
                let current = this.tableSettings['initComplete'];
                this.tableSettings['initComplete'] = function (settings, json) {
                    (current)(settings, json);
                    this.api().MakeCellsEditable(self.inlineEditingSettings);
                };
            } else {
                this.tableSettings['initComplete'] = function () {
                    this.api().MakeCellsEditable(self.inlineEditingSettings);
                };
            }
        }

        if (this.tableSettings['initComplete']) {
            this.settings['initComplete'] = this.tableSettings['initComplete'];
        }

        if (this.tableSettings.buttons) {
            this.settings.buttons = this.tableSettings.buttons;
        }

        if (this.tableSettings.dom) {
            this.settings.dom = this.tableSettings.dom;
        }

        if (this.tableSettings['searchCols']) {
            this.settings['searchCols'] = this.tableSettings['searchCols'];
        }

        // const scope = this;
        // this.settings.ajax.data = function (d) {
        // d.order[0].column = d.columns[d.order[0].column].data;
        // const sortBy = d.order[0];
        // d.order = JSON.stringify(sortBy);
        // d.filter = JSON.stringify(scope.searchData);
        // };

        // Load table in view
        this.dtOptions = this.settings;
        // this.table = $(this.el.nativeElement.querySelector('table'));
        // this.tableWidget = this.table.DataTable(this.settings);
    }

    public search(data: string): void {
        this.dtElement.dtInstance.then(dtInstance => {
            dtInstance.search(data);
        });
    }

    public searchColumn(column: string|number, value: string, paging: string|boolean = true): void {
        this.dtElement.dtInstance.then(dtInstance => {
            dtInstance
                .columns(column)
                .search(value)
                .draw(paging)
            ;
        });
    }

    // public reload(callback?: ((json: any) => void), resetPaging?: boolean): void {
    //     this.dtInitialization();
    //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.ajax.reload(callback, resetPaging);
    //     });
    // }

    public getTable(): DataTableDirective {
        return this.dtElement;
    }

    /**
     * @param uri Uri
     */
    // public setUrl(uri: string) {
    //     this.tableSettings.ajax = uri;
    //     this.reload();
    // }

    public clear() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance
                .clear()
                .draw();
        });
    }

    public recalc() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance['responsive'].recalc();
        });
    }

    public reset() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy(false);
            this.dtInitialization();
        });
    }

    public addRow(data:any, paging = false) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.row.add(data).draw(paging);
        });
    }

    public reloadWith(data: Array<any>, paging = false) {
        this.settings.data = data;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear().rows.add(this.settings.data).draw(paging);
        });
    }

    private additionalParams() {
        const params = this.tableSettings.dataParams;
        let queryString = '';
        if (params && params['query']) {
            queryString = '?';
            let count = 1;
            for (const key in params['query']) {
                if (params['query'].hasOwnProperty(key)) {
                    if (count++ > 1) {
                        queryString += '&';
                    }
                    queryString += `${key}=${params['query'][key]}`;
                }
            }
        }

        let uri = '';
        if (params && params.uri) {
            const p: Array<any> = params.uri;
            for (let i = 0; i < p.length; i++) {
                uri += p[i] + '/';
            }
        }

        return uri + queryString;
    }
}
