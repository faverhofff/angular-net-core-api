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
import {Observable, of, Subject} from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators';

declare var $: any;

const datatableEmptyResponse = {
    recordsTotal: 0,
    recordsFiltered: 0,
    data: [],
    error: '',
};

@Component({
    selector: 'app-datatable-net',
    templateUrl: './datatable.net.template.html'
})
export class DatatableNetComponent implements OnInit, AfterViewInit, OnDestroy {

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

    /**
     settings = {
          ajax:               string                  // URL Provided the data to be shown
          class:              string,                 // For custom css and custom functions over table
          onUserRowSelect:    boolean,                // For row select event
          columns:            json,                   // All columns of the model:
                                                      // 1- List of columns to select in popover:
                                                      //      show in table:              visible: true
                                                      //      can be enable\disable:      optional: true
                                                      // 2- List of columns to show in table: visible: true
          dataParams:         { }
          length:             number                  // Items to show per page

          fixedColumn: {
                scrollY: false,
                scrollX: true,
                scrollCollapse: true,
                fixedColumns: {
                    leftColumns: 1,
                    rightColumns: 1
                }
            }
      };
     * */
    settings = {
        data: [],  // Provisional until api integration(Change to "apiUrl: ''")
        forceEmptyData: false,
        class: '',
        columns: [],
        /**
         * Ex:. (* means not required)
         * [
         *    // tr1 definition
         *    {
         *        *className : "mi-tr1-class-name",
         *
         *        // th definitions
         *        columns : [
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
         *        columns : [
         *            {title: "Mi title 1", *colspan: 5, *rowspan: 3, *className: "mi-td1-class-name"},
         *            {title: "Mi title 2", *colspan: 5, *rowspan: 3, *className: "mi-td2-class-name"},
         *        ]
         *    }
         *
         * ]
         *
         * **********************************************************************************************
         *                                      IMPORTANT WARNING
         * **********************************************************************************************
         *    // If you define columnsHtml property, you also have to define aoColumns only with columns
         *    // mappings and/or other definitions as custom renderer
         *    // Ex:.
         *    aoColumns: [
         *      {data: id},
         *      {data: account_name},
         *      {data: created_at},
         *      {
         *          // Or custom rendered data
         *          render: function (data, type, row, meta) {
         *             return 'Mi custom render column data';
         *          }
         *      }
         *    ]
         *
         */
        columnsHtml: [],
        dataParams: {},
        length: 12,
        searching: false,
        processing: true,
        serverSide: true,
        ajax: {},
        language: {
            url: '/dist/assets/i18n/dt_en.json'
        },
        responsive: true,
        select: false,
        autoWidth: true,
        aoColumns: [],
        buttons: [],
        dom: 'Blfrtip',
        columnDefs: [],
        pageLength: 10,
        order: [[0, 'asc']],
        searchDelay: null,
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

        //SearchDelay
        if (this.tableSettings.hasOwnProperty('searchDelay')) {
            this.settings['searchDelay'] = this.tableSettings.searchDelay;
        }

        //AutoWidth
        if (this.tableSettings.hasOwnProperty('autoWidth')) {
            this.settings['autoWidth'] = this.tableSettings.autoWidth;
        }

        //Draw callback
        if (this.tableSettings.drawCallback) {
            this.settings['drawCallback'] = this.tableSettings.drawCallback;
        }

        //Header callback
        if (this.tableSettings.headerCallback) {
            this.settings['headerCallback'] = this.tableSettings.headerCallback;
        }

        //Order
        if (this.tableSettings.hasOwnProperty('order')) {
            this.settings['order'] = this.tableSettings.order;
        }

        //Ordering
        if (this.tableSettings.hasOwnProperty('ordering')) {
            this.settings['ordering'] = this.tableSettings.ordering;
        }

        //Footer callback
        if (this.tableSettings.footerCallback) {
            this.settings['footerCallback'] = this.tableSettings.footerCallback;
        }


        // Change basic configuration
        if (this.tableSettings.class) {
            this.settings.class = this.tableSettings.class;
        }

        // Set column definition initialisation properties.
        if (this.tableSettings.columnDefs) {
            this.settings['columnDefs'] = this.tableSettings.columnDefs;
        }

        // Set page size
        if (this.tableSettings.pageLength) {
            this.settings['pageLength'] = this.tableSettings.pageLength;
        }

        // Disable initial automatic ajax call
        if (this.tableSettings.hasOwnProperty('deferLoading')) {
            this.settings['deferLoading'] = this.tableSettings.deferLoading;
        }

        if (this.tableSettings.hasOwnProperty('ajax')) {
            this.url = this.tableSettings.ajax + this.additionalParams();
            //Setting url in ajax function object to be able to access it later
            // if (this.url && !this.settings.hasOwnProperty('deferLoading')) {

            // }
        }

        this.settings.ajax = (dataTablesParameters: any, callback) => {
            this.isLoadingData.emit(true);

            if (!this.url) {
                this.isLoadingData.emit(false);

                callback(datatableEmptyResponse);

                return;
            }

            this.http
                .post(this.url, dataTablesParameters)
                .pipe(
                    catchError(
                        (error: HttpErrorResponse): Observable<Object> => {
                            return of(datatableEmptyResponse);
                        }
                    )
                )
                .subscribe((resp: any) => {
                    this.isLoadingData.emit(false);
                  //  debugger
                    this.settings.ajax['response'] = resp;
                    callback(resp);
                });
        };

        this.settings.ajax['url'] = this.url;

        if (this.tableSettings.data || this.tableSettings.forceEmptyData) {
            delete this.settings.ajax;
            this.settings.serverSide = false;
            this.settings.data = this.tableSettings.data;
        }
        // if (this.tableSettings.pager) {
        //     this.settings.length = this.tableSettings.length;
        // }
        if (this.tableSettings.columns) {
            this.settings.columns = this.tableSettings.columns;
            this.settings.aoColumns = this.tableSettings.columns;
        } else if (this.tableSettings.columnsHtml) {
            this.settings.columnsHtml = this.tableSettings.columnsHtml;
            this.settings.aoColumns = this.tableSettings.aoColumns;
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

        if (this.tableSettings.search) {
            this.settings['search'] = this.tableSettings.search;
        }

        if (this.tableSettings.fixedColumn) {
            this.settings.responsive = false;
            // this.settings['ordering'] = false;

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

        // This params is to put some attribute to row level if a some condition is true
        // You need to pass a function
        if (this.tableSettings['rowCallback']) {
            this.settings['rowCallback'] = this.tableSettings['rowCallback'];
        }

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

    /**
     * Datatable search by column. Column parameter is an array of array of two values. Column id and value to search
     * for that column.
     *
     * @param {Array<[string, string|[string, boolean, boolean, boolean]]>} columns
     * @param {string | boolean} paging
     * @param {boolean} draw
     */
    public searchColumns(columns: Array<[string, string|[string, boolean, boolean, boolean]]>, paging: string|boolean = true, draw: boolean = true): void {
        this.dtElement.dtInstance.then(dtInstance => {
            columns.forEach((value) => {
                if (Array.isArray(value[1])) {
                    dtInstance
                        .column(value[0])
                        .search(value[1][0], value[1][1], value[1][2], value[1][3])
                } else {
                    dtInstance
                        .column(value[0])
                        .search(value[1] as string);
                }

            });

            if (draw) {
                dtInstance.draw(paging);
            }
        });
    }

    /**
     * Order datatable by given columns.
     *
     * @param {Array<number | string>} columns
     * @param {string} direction
     * @param {string | boolean} paging
     */
    public orderByColumns(columns: Array<number|string>, direction = 'asc', paging: string|boolean = true): void {
        this.dtElement.dtInstance.then(dtInstance => {
            dtInstance
                .columns(columns)
                .order(direction)
                .draw(paging)
            ;
        });
    }

    public reload(callback?: ((json: any) => void), resetPaging?: boolean): void {
        this.dtInitialization();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload(callback, resetPaging);
        });
    }

    public getTable(): DataTableDirective {
        return this.dtElement;
    }

    /**
     * @param uri Uri
     */
    public setUrl(uri: string) {
        this.tableSettings.ajax = uri;
        this.url = this.tableSettings.ajax + this.additionalParams();
        this.settings.ajax['url'] = this.url;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

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

    /**
     * Set new data params to table
     *
     * @param params
     */
    public setDataParams(params: any) {
        this.tableSettings.dataParams = params;
    }

    /**
     * Determine if table is empty.
     *
     * @return {Promise<boolean>}
     */
    public isEmpty(): Promise<boolean> {
        return this.dtElement.dtInstance.then(dtInstance => {
            return dtInstance
                .data()
                .any()
            ;
        });
    }
}
