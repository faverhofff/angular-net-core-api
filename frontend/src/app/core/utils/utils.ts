import {CurrencyPipe} from "@angular/common";
import {isNull, isNullOrUndefined, isObject} from "util";
import {ɵa} from "@yellowspot/ng-truncate";
import {IMyDate} from "mydatepicker";
import * as moment from "moment";

/**
 * This will run through the properties of each of the mixins and copy them over to the target of the mixins, filling
 * out the stand-in properties with their implementations.
 *
 * @param derivedCtor
 * @param {any[]} baseCtors
 */
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}


/**
 * A function to take a string written in dot notation style, and use it to
 * find a nested object property inside of an object.
 *
 * Useful in a plugin or module that accepts a JSON array of objects, but
 * you want to let the user specify where to find various bits of data
 * inside of each custom object instead of forcing a standardized
 * property list.
 *
 * @return the value of the property in question
 * @param propertyName Nested A dot notation style parameter reference (ie "urls.small")
 * @param object Object (optional) The object to search
 */

export function getProperty( propertyName: string, object: any) {
    let parts = propertyName.split( "." ),
        length = parts.length,
        i,
        property = object || this;

    for ( i = 0; i < length; i++ ) {
        property = property[parts[i]];
    }

    return property;
}

/**
 * Return the default value of the given value.
 *
 * @param value
 * @return {any}
 */
export function value(value: any) {
    return typeof value === 'function' ? value() : value;
}


/**
 * Get an item from an array or object using "dot" notation.
 *
 * @param target
 * @param {string | Array<string>} key
 * @param notFound
 * @return {any}
 */
export function dataGet(target: any, key: string|Array<string>, notFound: any = null): any {

    if (isNull(key)) {
        return target;
    }

    key = Array.isArray(key) ? key : key.split('.');

    for (let segment = key.shift(); !isNullOrUndefined(segment); segment = key.shift()) {

        if (Arr.accessible(target) && Arr.exists(target, segment)) {
            target = target[segment];
        } else if (isObject(target) && segment in target) {
            target = target[segment];
        } else {
            return value(notFound);
        }
    }

    return target;
}

/**
 * Tell if the target is null or not.
 *
 * @param target
 * @return {boolean}
 */
// export function isNull(target: any): boolean {
//     return target === null;
// }

export class Arr {
    /**
     * Determine whether the given value is array accessible.
     *
     * @param value
     * @return {boolean}
     */
    public static accessible(value: any): boolean {
        return Array.isArray(value);
    }

    /**
     * Determine if the given key exists in the provided array.
     *
     * @param {Array<any>} target
     * @param {string | number} key
     * @return {boolean}
     */
    public static exists(target: Array<any>, key: string|number) {

        for (let _key in target) {
            if (_key == key) {
                return true;
            }
        }

        return false;
    }

    /**
     * Join array to string by given property and separator.
     *
     * @param {Array<any>} data
     * @param {string} property
     * @param {string} separator
     * @return {string}
     */
    public static join(data: Array<any>, property: string, separator = ', ') {
        return pluck(data, property).join(separator);
    }
}

/**
 * Given an array of elements access "property" in each one an return a new array.
 *
 * @param {Array<any>} data
 * @param {string} property
 * @return {any[]}
 */
export function pluck(data: Array<any>, property: string) {
    return data.map(x => dataGet(x, property));
}

/**
 * Return usd currency parse
 * @param value
 * @param {string} digitsInfo
 */
export function currencyUSDRender(value: number, digitsInfo = '') {
    return new CurrencyPipe('en-US').transform(value, 'USD', 'symbol', digitsInfo);
}

/**
 * Render currency as Chilean Pesos.
 *
 * @param {number} value
 * @param {string} digitsInfo
 * @return {string | null}
 */
export function currencyCLPRender(value: number, digitsInfo = '1.0-0') {
    return new CurrencyPipe('es-CL').transform(value, 'CLP', 'symbol', digitsInfo);
}

/**
 * Determine if value is empty.
 *
 * @param value
 * @return {boolean}
 */
export function isEmpty(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0 || (Object.keys(value).length === 0 && value.constructor === Object);
}

/**
 * Determine client locale
 *
 * @return {string}
 */
export function clientLocale(): string {
    return navigator.languages
        ? navigator.languages[0]
        : (navigator.language || navigator['userLanguage'])
}

/**
 * Return a copy of the given object.
 *
 * @param {Partial<object>} obj
 * @return {object}
 */
export function copyObject(obj: Partial<object>): object {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * General behaviour for truncating glosa.
 *
 * @param {string} data
 * @return {string}
 */
export function truncateGlosa(data: string): string {
    return (new ɵa()).transform(data, 25);
}

/**
 * Transform a date string into a date picker data model format.
 *
 * @param {string} date
 * @param {string} format
 * @return {{date: IMyDate}}
 */
export function myDatePickerDateModelMaker(date: string, format: string = ''): {date: IMyDate} {

    let momentDate;

    if (!isEmpty(format)) {
        momentDate = moment(date, format);
    } else {
        momentDate = moment(date);
    }

    return {
            date: {
                year: momentDate.year(),
                month: momentDate.month() + 1,
                day: momentDate.date()
            }
        };
}
