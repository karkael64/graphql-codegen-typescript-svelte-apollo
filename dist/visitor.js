"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.SvelteApolloVisitor = void 0;
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var injectImports_1 = __importDefault(require("./injectImports"));
var SvelteApolloVisitor = /** @class */ (function (_super) {
    __extends(SvelteApolloVisitor, _super);
    function SvelteApolloVisitor(schema, fragments, _a, documents) {
        var loadGetClientFrom = _a.loadGetClientFrom, _b = _a.exportOnlyFunctions, exportOnlyFunctions = _b === void 0 ? false : _b, _c = _a.noExport, noExport = _c === void 0 ? false : _c, config = __rest(_a, ["loadGetClientFrom", "exportOnlyFunctions", "noExport"]);
        var _this = _super.call(this, schema, fragments, __assign(__assign({}, config), { noExport: exportOnlyFunctions || noExport }), {}, documents) || this;
        _this.imports = new Set();
        _this.svelteConfig = { loadGetClientFrom: loadGetClientFrom, noExport: exportOnlyFunctions && noExport };
        return _this;
    }
    SvelteApolloVisitor.prototype.getImports = function () {
        var loads = {};
        var apolloImports = [];
        if (this.svelteConfig.loadGetClientFrom) {
            loads[this.svelteConfig.loadGetClientFrom] = ['getClient'];
        }
        else {
            apolloImports.push('ApolloClient');
            loads['svelte'] = ['getContext', 'setContext'];
        }
        if (this.imports.size) {
            apolloImports.push.apply(apolloImports, this.imports);
        }
        if (apolloImports.length) {
            loads['@apollo/client'] = { type: apolloImports };
        }
        return __spreadArray(__spreadArray([], _super.prototype.getImports.call(this)), injectImports_1["default"](loads));
    };
    SvelteApolloVisitor.prototype.getExecutions = function () {
        return this.svelteConfig.loadGetClientFrom ? '' : this.getSvelteContext();
    };
    SvelteApolloVisitor.prototype.buildOperation = function (node, documentVariableName, operationType, operationResultType, operationVariablesTypes, requiresVariables) {
        if (!(node === null || node === void 0 ? void 0 : node.name)) {
            throw new Error('You should name all your operations');
        }
        var name = this.convertName(node.name.value);
        switch (operationType) {
            case 'Query':
                this.imports.add('QueryOptions');
                return this.buildQuery(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables);
            case 'Mutation':
                this.imports.add('MutationOptions');
                return this.buildMutation(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables);
            case 'Subscription':
                this.imports.add('SubscriptionOptions');
                return this.buildSubscription(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables);
        }
    };
    SvelteApolloVisitor.prototype.buildQuery = function (name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        var $e = this.svelteConfig.noExport ? '' : 'export ';
        var $d = requiresVariables ? ' = {}' : '';
        return $e + "const Query" + name + " = (\n      options: Omit<QueryOptions<" + operationVariablesTypes + ">, \"query\">" + $d + "\n    ) => getClient().query<" + operationResultType + ">({ query: " + documentVariableName + ", ...options })\n    ";
    };
    SvelteApolloVisitor.prototype.buildMutation = function (name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        var $e = this.svelteConfig.noExport ? '' : 'export ';
        var $d = requiresVariables ? ' = {}' : '';
        return $e + "const Mutation" + name + " = (\n      options: Omit<MutationOptions<" + operationResultType + ", " + operationVariablesTypes + ">, \"mutation\">" + $d + "\n    ) => getClient().mutate({ mutation: " + documentVariableName + ", ...options })\n    ";
    };
    SvelteApolloVisitor.prototype.buildSubscription = function (name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        var $e = this.svelteConfig.noExport ? '' : 'export ';
        var $d = requiresVariables ? ' = {}' : '';
        return $e + "const Subscription" + name + " = (\n      options: Omit<SubscriptionOptions<" + operationVariablesTypes + ">, \"query\">" + $d + "\n    ) => getClient().subscribe<" + operationResultType + ">({ query: " + documentVariableName + ", ...options })\n    ";
    };
    SvelteApolloVisitor.prototype.getSvelteContext = function () {
        return "\nconst CLIENT = typeof Symbol !== \"undefined\" ? Symbol(\"client\") : \"@@client\";\n\nexport function getClient<TCache = any>() {\n\tconst client = getContext(CLIENT);\n\tif (!client) {\n\t\tthrow new Error(\n\t\t\t\"ApolloClient has not been set yet, use setClient(new ApolloClient({ ... })) to define it\"\n\t\t);\n\t}\n\treturn client as ApolloClient<TCache>;\n}\n\nexport function setClient<TCache = any>(client: ApolloClient<TCache>): void {\n\tsetContext(CLIENT, client);\n}\n";
    };
    return SvelteApolloVisitor;
}(visitor_plugin_common_1.ClientSideBaseVisitor));
exports.SvelteApolloVisitor = SvelteApolloVisitor;
