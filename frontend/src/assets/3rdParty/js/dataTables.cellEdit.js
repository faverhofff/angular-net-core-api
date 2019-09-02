﻿/*! CellEdit 1.0.19
 * ©2016 Elliott Beaty - datatables.net/license
 */

/**
 * @summary     CellEdit
 * @description Make a cell editable when clicked upon
 * @version     1.0.19
 * @file        dataTables.editCell.js
 * @author      Elliott Beaty
 * @contact     elliott@elliottbeaty.com
 * @copyright   Copyright 2016 Elliott Beaty
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

jQuery.fn.dataTable.Api.register('MakeCellsEditable()', function (settings) {
    var table = this.table();

    function getInputHtml(currentColumnIndex, settings, oldValue) {

        var inputSetting, inputType, input, inputCss, confirmCss, cancelCss;

        if (settings.inputTypes) {
            $.each(settings.inputTypes, function (index, setting) {
                if (setting.column == currentColumnIndex) {
                    inputSetting = setting;
                    inputType = inputSetting.type.toLowerCase();
                }
            });
        }

        if (settings.inputCss) {
            inputCss = settings.inputCss;
        }
        if (settings.confirmationButton) {
            confirmCss = settings.confirmationButton.confirmCss;
            cancelCss = settings.confirmationButton.cancelCss;
            inputType = inputType + "-confirm";
        }
        switch (inputType) {
            case "list":
            case "list-confirm": // List w/ confirm
                var html = "<select class='" + inputCss + "'>";
                $.each(inputSetting.options, function (index, option) {
                    if (oldValue == option.value) {
                        html = html + "<option value='" + option.value + "' selected>" + option.display + "</option>"
                    } else {
                        html = html + "<option value='" + option.value + "' >" + option.display + "</option>"
                    }
                });
                html = html + "</select>";
                var $input = $(html);

                if(inputType == 'list'){
                    $input.on('change',function(){
                        updateEditableCell(this);
                    });
                    return [$input];
                }else{
                    return [$input, getConfirmButton(), getCancelButton()];
                }

            case "datepicker": //Both datepicker options work best when confirming the values
            case "datepicker-confirm":
                // Makesure jQuery UI is loaded on the page
                if (typeof jQuery.ui == 'undefined') {
                    alert("jQuery UI is required for the DatePicker control but it is not loaded on the page!");
                    break;
                }
                jQuery(".datepick").datepicker("destroy");
                var $input = $('<input>').attr('id','ejbeatycelledit')
                    .attr('name','date')
                    .attr('type','text')
                    .addClass(inputCss)
                    .addClass('datepick')
                    .attr('value',oldValue);

                setTimeout(function () { //Set timeout to allow the script to write the input.html before triggering the datepicker
                    var icon = "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif";
                    // Allow the user to provide icon
                    if (typeof inputSetting.options !== 'undefined' && typeof inputSetting.options.icon !== 'undefined') {
                        icon = inputSetting.options.icon;
                    }
                    var self = jQuery('.datepick').datepicker(
                        {
                            showOn: "button",
                            buttonImage: icon,
                            buttonImageOnly: true,
                            buttonText: "Select date"
                        });
                }, 100);
                return [$input, getConfirmButton(), getCancelButton()];

            case "text-confirm": // text input w/ confirm
            case "undefined-confirm": // text input w/ confirm
                var $input = $('<input>').attr('id','ejbeatycelledit')
                    .addClass(inputCss)
                    .attr('value',oldValue);
                return [$input, getConfirmButton(), getCancelButton()];

            case "textarea":
            case "textarea-confirm":
                var $input = $('<textarea>').attr('id','ejbeatycelledit')
                    .addClass(inputCss)
                    .val(oldValue);
                return [$input, getConfirmButton(), getCancelButton()];

            default: // text input
                var $input = $('<input>').attr('id','ejbeatycelledit')
                    .addClass(inputCss)
                    .attr('value',oldValue)
                    .on('blur', function(){
                        updateEditableCell(this);
                    });
                return [$input];

        }
        return;
    }

    function getConfirmButton(){
        var confirmCss='';
        if (settings.confirmationButton) {
            confirmCss = settings.confirmationButton.confirmCss;
        }
        var $ok = $('<a>').attr('href','javascript:void(0);')
            .addClass(confirmCss)
            .html("<span>Guardar</span>")
            .on('click',function(){
                updateEditableCell(this);
            });
        return $ok;
    }

    function getCancelButton(){
        var cancelCss='';
        if (settings.confirmationButton) {
            cancelCss = settings.confirmationButton.cancelCss;
        }
        var $cancel = $('<a>').attr('href','javascript:void(0);')
            .addClass(cancelCss)
            .html("<span>Cancelar</span>")
            .on('click',function(){
                cancelEditableCell(this);
            });
        return $cancel;
    }

    function getInputField(callingElement) {
        // Update datatables cell value
        var inputField;
        switch ($(callingElement).prop('nodeName').toLowerCase()) {
            case 'a': // This means they're using confirmation buttons
                if ($(callingElement).siblings('input').length > 0) {
                    inputField = $(callingElement).siblings('input');
                }
                if ($(callingElement).siblings('select').length > 0) {
                    inputField = $(callingElement).siblings('select');
                }
                if ($(callingElement).siblings('textarea').length > 0) {
                    inputField = $(callingElement).siblings('textarea');
                }
                break;
            default:
                inputField = $(callingElement);
        }
        return inputField;
    }

    function sanitizeCellValue(cellValue) {
        if (typeof (cellValue) === 'undefined' || cellValue === null || cellValue.length < 1) {
            return "";
        }

        // If not a number
        if (isNaN(cellValue)) {
            // escape single quote
            cellValue = cellValue.replace(/'/g, "&#39;");
        }
        return cellValue;
    }

    /**
     * When calling onUpdate this call could return a Promise. The expected params when resolving is an object with the
     * following properties
     * {
     *   skipDrawing: true // Used for avoiding datatable redrawing after an update.
     * }
     * @param callingElement
     */
    function updateEditableCell(callingElement) {
        // Need to redeclare table here for situations where we have more than one datatable on the page. See issue6 on github
        var table = $(callingElement).closest("table").DataTable().table();
        var row = table.row($(callingElement).parents('tr'));
        var cell = table.cell($(callingElement).parent());
        var columnIndex = cell.index().column;
        var inputField = getInputField(callingElement);
        var promise = Promise.resolve();

        // Update
        var newValue = inputField.val();
        if (!newValue && ((settings.allowNulls) && settings.allowNulls != true)) {
            // If columns specified
            if (settings.allowNulls.columns) {
                // If current column allows nulls
                if (settings.allowNulls.columns.indexOf(columnIndex) > -1) {
                    promise = promise.then(() => {
                        return _update(newValue);
                    });
                } else {
                    _addValidationCss();
                }
                // No columns allow null
            } else if (!newValue) {
                _addValidationCss();
            }
            //All columns allow null
        } else if (newValue && settings.onValidate) {
            if (settings.onValidate(cell, row, newValue)) {
                promise = promise.then(() => {
                    return _update(newValue);
                });
            } else {
                _addValidationCss();
            }
        } else {
            promise = promise.then(() => {
                return _update(newValue);
            });
        }
        function _addValidationCss() {
            // Show validation error
            if (settings.allowNulls.errorClass) {
                $(inputField).addClass(settings.allowNulls.errorClass)
            } else {
                $(inputField).css({"border": "red solid 1px"});
            }
        }

        function _update(newValue) {
            var oldValue = cell.data();
            cell.data(newValue);
            //Return cell & row.
            return settings.onUpdate(cell, row, oldValue);
        }

        // Get current page
        var currentPageIndex = table.page.info().page;

        promise
            //Asks if it is needed to skip redrawing the table
            .then(function(options) {
                if (options && options.skipDrawing) {
                    return options;
                }

                //Redraw table
                table.page(currentPageIndex).draw(false);

                return options;
            });
    }

    function cancelEditableCell(callingElement) {
        var table = $(callingElement.closest("table")).DataTable().table();
        var cell = table.cell($(callingElement).parent());
        // Set cell to it's original value
        cell.data(cell.data());

        // Redraw table
        table.draw();
    }

    if (settings === "destroy") {
        $(table.body()).off("click", "td");
        table = null;
    }

    if (table != null) {
        $(table.body()).on('click', 'td', function () {
            var currentColumnIndex = table.cell(this).index().column;
            if ((settings.columns && settings.columns.indexOf(currentColumnIndex) > -1) || (!settings.columns)) {
                var row = table.row($(this).parents('tr'));
                editableCellsRow = row;

                var cell = table.cell(this).node();
                var oldValue = table.cell(this).data();
                oldValue = sanitizeCellValue(oldValue);

                if (!$(cell).find('input').length && !$(cell).find('select').length && !$(cell).find('textarea').length) {
                    var input = getInputHtml(currentColumnIndex, settings, oldValue);
                    $(cell).empty();
                    for (var i = 0; i < input.length; i++) {
                        $(cell).append(input[i]);
                    }
                    $('#ejbeatycelledit').focus();
                }
            }
        });
    }
});