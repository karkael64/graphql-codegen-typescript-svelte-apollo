"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.plugin = void 0;
var graphql_1 = require("graphql");
var visitor_1 = require("./visitor");
var isString = function (item) { return typeof item === 'string'; };
var isFragmentDefinition = function (node) {
    return node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
};
var mapLoadedFragments = function (allAst, externalFragments) { return __spreadArray(__spreadArray([], allAst.definitions.filter(isFragmentDefinition).map(function (fragmentDef) { return ({
    node: fragmentDef,
    name: fragmentDef.name.value,
    onType: fragmentDef.typeCondition.name.value,
    isExternal: false
}); })), (externalFragments || [])); };
var plugin = function (schema, documents, config) {
    var allAst = graphql_1.concatAST(documents.map(function (v) { return v.document; }));
    var visitor = new visitor_1.SvelteApolloVisitor(schema, mapLoadedFragments(allAst, config.externalFragments), config, documents);
    var visitorResult = graphql_1.visit(allAst, { leave: visitor });
    var imports = visitor.getImports();
    var executions = visitor.getExecutions();
    var fragments = visitor.fragments;
    var definitions = visitorResult.definitions.filter(isString).join('\n');
    return {
        prepend: imports,
        content: [executions, fragments, definitions].join('\n\n').trim()
    };
};
exports.plugin = plugin;
