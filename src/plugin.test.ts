import gql from 'graphql-tag'
import type { ExecutionResult } from 'graphql'
import { createServer } from '../testing/server'
import { request } from '../testing/request'
import plugin from './index'

it('should bootstrap a graphql server', async () => {
  await createServer([
    plugin({
      schema: {
        typeDefs: gql`
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
  ])

  const response = await request(gql`
    query {
      hello
    }
  `)

  expect(response).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      hello: 'Hello World',
    },
  })
})

it('should serve the graphql on a custom url', async () => {
  const SERVER_PATH = 'graphql-server'

  await createServer([
    plugin({
      server: {
        path: SERVER_PATH,
      },
      schema: {
        typeDefs: gql`
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
  ])

  const response = await request(
    gql`
      query {
        hello
      }
    `,
    {},
    { path: SERVER_PATH },
  )

  expect(response).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      hello: 'Hello World',
    },
  })
})

it('should support string schema', async () => {
  await createServer([
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
  ])

  const response = await request(gql`
    query {
      hello
    }
  `)

  expect(response).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      hello: 'Hello World',
    },
  })
})

it('should throw error if `schema.typeDefs` not provided in the configuration', async () => {
  await expect(async () => {
    await createServer([
      plugin({
        // @ts-expect-error - typeDefs option is required
        schema: {
          resolvers: {
            Query: {
              hello: () => 'Hello World',
            },
          },
        },
      }),
    ])
  }).rejects.toThrowError(
    '[Vite GraphQL Server]: Error: `schema.typeDefs` and `schema.resolvers` are required configurations.',
  )
})

it('should throw error if `schema.resolvers` not provided in the configuration', async () => {
  await expect(async () => {
    await createServer([
      plugin({
        // @ts-expect-error - resolvers option is required
        schema: {
          typeDefs: `
          type Query {
            hello: String!
          }
        `,
        },
      }),
    ])
  }).rejects.toThrowError(
    '[Vite GraphQL Server]: Error: `schema.typeDefs` and `schema.resolvers` are required configurations.',
  )
})

it('should support `contextValue` configuration', async () => {
  const spy = vi.fn()
  const contextValue = { message: 'Hello World' }

  await createServer([
    plugin({
      contextValue,
      schema: {
        typeDefs: gql`
          type Query {
            hello: String!
          }
        `,
        resolvers: {
          Query: {
            hello: (_, __, ctx) => {
              spy(ctx)
              return ctx.message
            },
          },
        },
      },
    }),
  ])

  const response = await request(gql`
    query {
      hello
    }
  `)

  expect(spy).toHaveBeenCalledWith(contextValue)
  expect(response).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      hello: 'Hello World',
    },
  })
})

it('should support schema with query and mutation `variables`', async () => {
  const spy = vi.fn()

  await createServer([
    plugin({
      schema: {
        typeDefs: gql`
          input MessageInput {
            content: String
          }

          type Message {
            content: String
          }

          type Query {
            getMessage(id: ID!): Message
          }

          type Mutation {
            createMessage(input: MessageInput): Message
          }
        `,
        resolvers: {
          Query: {
            getMessage: (_, args) => {
              spy(args)
              return {
                content: `Message: ${args.id}`,
              }
            },
          },
          Mutation: {
            createMessage: (_, args) => {
              spy(args)
              return {
                content: `Message: ${args.input.content}`,
              }
            },
          },
        },
      },
    }),
  ])

  const query = await request(
    gql`
      query getMessage($id: ID!) {
        getMessage(id: $id) {
          content
        }
      }
    `,
    {
      id: 'Hello-World',
    },
  )

  expect(query).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      getMessage: {
        content: 'Message: Hello-World',
      },
    },
  })

  const mutation = await request(
    gql`
      mutation createMessage($input: MessageInput!) {
        createMessage(input: $input) {
          content
        }
      }
    `,
    {
      input: {
        content: 'Hello World',
      },
    },
  )

  expect(mutation).toEqual<ExecutionResult>({
    errors: undefined,
    data: {
      createMessage: {
        content: 'Message: Hello World',
      },
    },
  })
})
