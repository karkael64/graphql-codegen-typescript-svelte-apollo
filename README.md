# Graphql-Codegen-Typescript-Svelte-Apollo

This plugin generates functions with TypeScript typings using Svelte context. It extends the basic TypeScript plugins: `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations` - and thus shares a similar configuration.

## Installation

```shell
yarn add @graphql-codegen/typescript @graphql-codegen/typescript-operations graphql-codegen-typescript-svelte-apollo
```

## API reference

### Option `loadGetClientFrom`

type: `string`
default: `undefined`

Overrides the path from where getClient is load. The function should return ApolloClient instance. Compatible with Svelte-Apollo package (from Microsoft).

```yaml
generates:
path/to/file.ts:
  plugins:
    - typescript
    - typescript-operations
    - typescript-svelte-apollo
  config:
    loadGetClientFrom: ./client
```

### Option `exportOnlyFunctions`

type: `boolean`
default: `false`

If true, the generated file exports only functions (getClient, setClient, queries, mutations, subscriptions). The graphql documents, data types, input and output formats are not exported.

```yaml
generates:
path/to/file.ts:
  plugins:
    - typescript
    - typescript-operations
    - typescript-svelte-apollo
  config:
    exportOnlyFunctions: true
```

## Basic query

For the given input:

```graphql
query ListUsers {
  feed {
    id
  }
}
```

We can use the generated code by setting ApolloClient context:

```svelte
// file: src/modules/App.svelte
<script lang="ts">
  import { ApolloClient, InMemoryCache } from "@apollo/client";
  import { setClient } from "../graphql/generated";
  import User from "./User.svelte";

  setClient(new ApolloClient({
    uri: process.env.URL_GRAPHQL,
    cache: new InMemoryCache({ addTypename: true }),
    connectToDevTools: true,
  }));
</script>

<main>
  <h1>Svelte + GraphQL Codegen</h1>
  <User />
</main>
```

And using the queries in children components:

```svelte
// file: src/modules/User.svelte
<script lang="ts">
  import { QueryListUsers } from "../graphql/generated";
  const usersQuery = QueryListUsers({});
</script>

{#await usersQuery}
  <p>Loading users...</p>
{:then user}
  <pre>{JSON.stringify(user, null, 1)}</pre>
{:catch error}
  <p>{error}</p>
{/await}
```
