<br/>

<h1 align='center'>Vite GraphQL Server</h1>

<p align='center'>Bootstrap a local GraphQL server in your Vite project</p>

<br/>

## Introduction

This plugin helps you bootstrap a local GraphQL server in your Vite project with
the minimum amount of setup and configuration. It is helpful for prototyping,
local development, and debugging.

## Getting Started

First, install the plugin:

```bash
npm install --save-dev vite-plugin-graphql-server

yarn add --dev vite-plugin-graphql-server

pnpm add --save-dev vite-plugin-graphql-server
```

Then, add the plugin to your `vite.config.ts` and pass in your GraphQL schema
and resolvers:

```ts
import { defineConfig } from 'vite'
import GraphqlServer from 'vite-plugin-graphql-server'

export default defineConfig({
  plugins: [
    plugin({
      schema: {
        typeDefs: `
          type Query {
            hello: String!
          }
        `,
        resolvers: {
          Query: {
            hello: () => 'Hello World',
          },
        },
      },
    }),
  ],
})
```

Now, you can start your Vite server and your GraphQL server will be available at
`http://localhost:5173/__graphql`.

## Related Projects

- [vite-plugin-graphiql](https://github.com/mammadataei/vite-plugin-graphiql):
  Integrate GraphiQL IDE in your Vite projects. It is a great companion to this
  plugin. You can use it to explore your GraphQL schema and execute queries
  against your local GraphQL server.

- [@graphql-utils/store](https://github.com/graphql-utils/store): In-memory data
  store for writing stateful GraphQL mocks. You can use it to store data in your
  GraphQL server and use it in your resolvers without having to set up a
  database.

## License

Licensed under the [MIT License](LICENSE).
