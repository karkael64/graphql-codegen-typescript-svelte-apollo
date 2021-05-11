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
export default function injectImports<T extends string | Record<string, string> | (string | Record<string, string>)[]>(source: Record<string, T>, isTypeOnly?: boolean): string[];
