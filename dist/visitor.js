"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteApolloVisitor = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const injectImports_1 = __importDefault(require("./injectImports"));
class SvelteApolloVisitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
    constructor(schema, fragments, _a, documents) {
        var { loadGetClientFrom, exportOnlyFunctions = false, noExport = false } = _a, config = __rest(_a, ["loadGetClientFrom", "exportOnlyFunctions", "noExport"]);
        super(schema, fragments, Object.assign(Object.assign({}, config), { noExport: exportOnlyFunctions || noExport }), {}, documents);
        this.imports = new Set();
        this.svelteConfig = { loadGetClientFrom, noExport: exportOnlyFunctions && noExport };
    }
    getImports() {
        const loads = {};
        const apolloImports = [];
        if (this.svelteConfig.loadGetClientFrom) {
            loads[this.svelteConfig.loadGetClientFrom] = ['getClient'];
        }
        else {
            apolloImports.push('ApolloClient');
            loads['svelte'] = ['getContext', 'setContext'];
        }
        if (this.imports.size) {
            apolloImports.push(...Array.from(this.imports));
        }
        if (apolloImports.length) {
            loads['@apollo/client'] = { type: apolloImports };
        }
        return [...super.getImports(), ...injectImports_1.default(loads)];
    }
    getExecutions() {
        return this.svelteConfig.loadGetClientFrom ? '' : this.getSvelteContext();
    }
    buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes, requiresVariables) {
        if (!(node === null || node === void 0 ? void 0 : node.name)) {
            throw new Error('You should name all your operations');
        }
        const name = this.convertName(node.name.value);
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
    }
    buildQuery(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        const $e = this.svelteConfig.noExport ? '' : 'export ';
        const $d = requiresVariables ? ' = {}' : '';
        return `${$e}const Query${name} = (
      options: Omit<QueryOptions<${operationVariablesTypes}>, "query">${$d}
    ) => getClient().query<${operationResultType}>({ query: ${documentVariableName}, ...options })
    `;
    }
    buildMutation(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        const $e = this.svelteConfig.noExport ? '' : 'export ';
        const $d = requiresVariables ? ' = {}' : '';
        return `${$e}const Mutation${name} = (
      options: Omit<MutationOptions<${operationResultType}, ${operationVariablesTypes}>, "mutation">${$d}
    ) => getClient().mutate({ mutation: ${documentVariableName}, ...options })
    `;
    }
    buildSubscription(name, documentVariableName, operationResultType, operationVariablesTypes, requiresVariables) {
        const $e = this.svelteConfig.noExport ? '' : 'export ';
        const $d = requiresVariables ? ' = {}' : '';
        return `${$e}const Subscription${name} = (
      options: Omit<SubscriptionOptions<${operationVariablesTypes}>, "query">${$d}
    ) => getClient().subscribe<${operationResultType}>({ query: ${documentVariableName}, ...options })
    `;
    }
    getSvelteContext() {
        return `
const CLIENT = typeof Symbol !== "undefined" ? Symbol("client") : "@@client";

export function getClient<TCache = any>() {
	const client = getContext(CLIENT);
	if (!client) {
		throw new Error(
			"ApolloClient has not been set yet, use setClient(new ApolloClient({ ... })) to define it"
		);
	}
	return client as ApolloClient<TCache>;
}

export function setClient<TCache = any>(client: ApolloClient<TCache>): void {
	setContext(CLIENT, client);
}
`;
    }
}
exports.SvelteApolloVisitor = SvelteApolloVisitor;
