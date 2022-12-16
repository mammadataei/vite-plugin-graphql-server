import { DocumentNode, ExecutionResult, print } from 'graphql/index'

interface RequestOptions {
  path?: string
  port?: number
}

export function request<TData>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
  options: RequestOptions = {},
): Promise<ExecutionResult<TData>> {
  const { port = 5173, path = '__graphql' } = options

  return fetch(`http://localhost:${port}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: print(query), variables }),
  }).then((res) => res.json())
}
