"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const graphql_1 = require("graphql");
const visitor_1 = require("./visitor");
const isString = (item) => typeof item === 'string';
const isFragmentDefinition = (node) => node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
const mapLoadedFragments = (allAst, externalFragments) => [
    ...allAst.definitions.filter(isFragmentDefinition).map(fragmentDef => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
    })),
    ...(externalFragments || []),
];
const plugin = (schema, documents, config) => {
    const allAst = graphql_1.concatAST(documents.map(v => v.document));
    const visitor = new visitor_1.SvelteApolloVisitor(schema, mapLoadedFragments(allAst, config.externalFragments), config, documents);
    const visitorResult = graphql_1.visit(allAst, { leave: visitor });
    const imports = visitor.getImports();
    const executions = visitor.getExecutions();
    const fragments = visitor.fragments;
    const definitions = visitorResult.definitions.filter(isString).join('\n');
    return {
        prepend: imports,
        content: [executions, fragments, definitions].join('\n\n').trim(),
    };
};
exports.plugin = plugin;
