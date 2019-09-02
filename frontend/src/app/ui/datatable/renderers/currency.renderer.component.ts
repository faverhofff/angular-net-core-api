/**
 * Created by Indira Guerra on 5/11/18.
 */

import {Component} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
    template: ``
})

export class CurrencyRendererComponent {

    static formatValue(data, type, row, meta) {
        const currency = new CurrencyPipe('en-US').transform(data, 'USD', 'symbol-narrow');

        if (currency) {
            if (data && data > 0) {
                return `<div class="">${currency}</div>`;
            } else {
                return `<div class="text-danger">(${currency})</div>`;
            }
        }
    }

    static formatCurrency ( value, thousands, decimal, precision, prefix ) {
        var negative = value < 0 ? '-' : '';
        value = Math.abs( parseFloat( value ) );

        var intPart = parseInt( value, 10 );
        var floatPart = precision ?
            decimal+(value - intPart).toFixed( precision ).substring( 2 ):
            '';

        return negative + (prefix||'') +
            intPart.toString().replace(
                /\B(?=(\d{3})+(?!\d))/g, thousands
            ) +
            floatPart;
    }
}
