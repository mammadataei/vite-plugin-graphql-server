import { Connect } from 'vite'
import { graphql } from 'graphql'
import type { GraphQLSchema } from 'graphql'
import type { IncomingMessage, ServerResponse } from 'http'
import { RequestPayload } from './types'

export function handlerGraphQLRequest(schema: GraphQLSchema) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (req.method !== 'POST') {
      console.warn(
        '[Vite GraphQL Server]: Warning: Only `POST` requests are supported.',
      )
      next()
    }

    const body = await getRequestBody<RequestPayload>(req)

    const result = await graphql({
      schema,
      source: body.query,
    })

    res.setHeader('Content-Type', 'application/json')
    res.write(toJson(result))
    res.end()
  }
}

export function getRequestBody<Body>(req: IncomingMessage) {
  return new Promise<Body>((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      resolve(JSON.parse(body))
    })
    req.on('error', (err) => {
      reject(err)
    })
  })
}

export function normalizeURLPath(path: string) {
  return path.startsWith('/') ? path : `/${path}`
}

export function toJson(obj: unknown) {
  return JSON.stringify(obj, null, 2)
}
