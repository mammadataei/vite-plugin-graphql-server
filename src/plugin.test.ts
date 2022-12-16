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
