import type { PluginOption } from 'vite'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { GraphQLServerPluginOptions } from './types'
import { handlerGraphQLRequest, normalizeURLPath } from './utils'

export default function <TContext>(
  options: GraphQLServerPluginOptions<TContext>,
): PluginOption {
  return {
    name: 'vite-plugin-graphql-server',
    apply: 'serve',

    configureServer(server) {
      if (!options.schema.resolvers || !options.schema.typeDefs) {
        throw new Error(
          '[Vite GraphQL Server]: Error: `schema.typeDefs` and `schema.resolvers` are required configurations.',
        )
      }

      const schema = makeExecutableSchema(options.schema)

      server.middlewares.use(
        normalizeURLPath(options.server?.path ?? '/__graphql'),
        handlerGraphQLRequest(schema),
      )
    },
  }
}
