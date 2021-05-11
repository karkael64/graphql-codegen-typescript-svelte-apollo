import type { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { SvelteApolloVisitorConfig } from './config';
export declare class SvelteApolloVisitor extends ClientSideBaseVisitor {
    private imports;
    private svelteConfig;
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], { loadGetClientFrom, exportOnlyFunctions, noExport, ...config }: SvelteApolloVisitorConfig, documents?: Types.DocumentFile[]);
    getImports(): string[];
    getExecutions(): string;
    protected buildOperation(node: OperationDefinitionNode, documentVariableName: string, operationType: 'Query' | 'Mutation' | 'Subscription', operationResultType: string, operationVariablesTypes: string, requiresVariables: boolean): string;
    private buildQuery;
    private buildMutation;
    private buildSubscription;
    private getSvelteContext;
}
