"use strict";
// The function `injectImports` below helps you to create easy import syntax in you typescript file.
exports.__esModule = true;
var isString = function (item) { return typeof item === 'string'; };
var isObject = function (item) { return !!(item && typeof item === 'object'); };
var stringSplice = function (text, start, length) {
    var insert = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        insert[_i - 3] = arguments[_i];
    }
    var _start = start < 0 ? Math.max(0, text.length - start) : Math.min(start, text.length);
    var begin = text.slice(0, _start);
    var middle = insert.join('');
    var last = length === undefined ? '' : text.slice(_start + length);
    return "" + begin + middle + last;
};
var ellipsisQuoted = function (text, length) {
    if (length === void 0) { length = 40; }
    var _length = Math.max(4, length) - 1;
    var quoted = "" + JSON.stringify(text);
    return quoted.length < _length + 2 ? quoted : stringSplice(quoted, _length - 1, quoted.length - _length, '…');
};
var stringShouldMatch = function (text, rx, errorMessage) {
    if (text.match(rx)) {
        return text;
    }
    throw new Error(errorMessage);
};
var shouldBeVariableName = function (text) {
    return stringShouldMatch(text, /^[_A-Za-z]\w*$/, "Syntax error, string " + ellipsisQuoted(text) + " is not a variable name");
};
/**
 * Function `injectImports` helps you to create `import` syntax in you typescript file.
 * @name injectImports
 * @param {Object} source is a dictionary associating `keys` as paths to `values` as imported variables
 * @param {boolean} isTypeOnly transforms `import` to `import type`.
 * @returns {string[]} imports lines separated by paths.
 *
 * @example
 * // returns [
 * //   'import gql from "graphql-tag"',
 * //   'import type { QueryOptions } from "@apollo/client"',
 * //   'import { getContext as getSvelteContext, setContext } from "svelte"',
 * //   'import "../common"',
 * //   'import * as allStyles from "./styles"'
 * // ];
 * injectImports({
 *   "graphql-tag": "gql",
 *   "@apollo/client": { "type": [ QueryOptions ] },
 *   "svelte": [ { "getContext": "getSvelteContext" }, "setContext" ],
 *   "../common": true,
 *   "./styles": { "*": "allStyles" }
 * });
 */
function injectImports(source, isTypeOnly) {
    if (isTypeOnly === void 0) { isTypeOnly = false; }
    var paths = Object.entries(source);
    var t = isTypeOnly ? 'import type' : 'import';
    return paths.map(function (_a) {
        var _b;
        var path = _a[0], value = _a[1];
        if (isString(value)) {
            return t + " " + shouldBeVariableName(value) + " from \"" + path + "\"";
        }
        if (Array.isArray(value)) {
            var items = value
                .map(function (sub) {
                if (isString(sub)) {
                    return shouldBeVariableName(sub);
                }
                if (isObject(sub)) {
                    var firstKey = Object.keys(sub)[0];
                    return shouldBeVariableName(firstKey) + " as " + shouldBeVariableName(sub[firstKey]);
                }
            })
                .filter(isString);
            if (items.length) {
                return t + " { " + items.join(', ') + " } from \"" + path + "\";";
            }
        }
        else if (isObject(value)) {
            if (isObject(value.type)) {
                return injectImports((_b = {}, _b[path] = value.type, _b), true)[0];
            }
            if (value['*']) {
                return t + " * as " + shouldBeVariableName(value['*']) + " from \"" + path + "\";";
            }
            var items = Object.entries(value).map(function (_a) {
                var name = _a[0], alias = _a[1];
                return shouldBeVariableName(name) + " as " + shouldBeVariableName(alias);
            });
            if (items.length) {
                return t + " { " + items.join(', ') + " } from \"" + path + "\";";
            }
        }
        return t + " \"" + path + "\";";
    });
}
exports["default"] = injectImports;
