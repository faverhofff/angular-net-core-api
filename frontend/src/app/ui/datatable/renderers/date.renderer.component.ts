/**
 * Created by Indira Guerra on 5/11/18.
 */

import {Component} from '@angular/core';
import {DatePipe} from '@angular/common';

@Component({
    template: ``
})

export class DateRendererComponent {

    static formatValue(data, type, row, meta) {
        if (data) {
            const date = new DatePipe('en-US').transform(data, 'MM/dd/yyyy');

            return `<div class="">${date}</div>`;

        } else {
            return '';
        }
    }
}
