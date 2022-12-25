import type {
  DefinitionNode,
  DocumentNode,
  GraphQLSchema,
  Source,
} from 'graphql'
import type { IExecutableSchemaDefinition } from '@graphql-tools/schema'

type WithRequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type TypeSource =
  | string
  | Source
  | DocumentNode
  | GraphQLSchema
  | DefinitionNode
  | Array<TypeSource>
  | (() => TypeSource)

export type RequestPayload = {
  query: string
  variables: Record<string, any>
}

export interface GraphQLServerPluginOptions<TContext> {
  /**
   * Graphql server configurations.
   */
  server?: {
    /**
     * The path to serve the GraphQL server on.
     * @default '__graphql'
     */
    path?: string
  }

  contextValue?: TContext

  /**
   * GraphQL schema configurations.
   */
  schema: WithRequiredProperty<
    IExecutableSchemaDefinition<TContext>,
    'resolvers'
  >
}
