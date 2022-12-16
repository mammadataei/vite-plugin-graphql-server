import {
  createServer as createViteServer,
  PluginOption,
  ViteDevServer,
} from 'vite'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  let server: null | ViteDevServer
}

export async function createServer(plugins: PluginOption[]) {
  const server = await createViteServer({
    optimizeDeps: { include: [] },
    plugins,
  })

  globalThis.server = server

  return await server.listen()
}

afterEach(async () => {
  if (globalThis.server) {
    await globalThis.server.close()
  }

  globalThis.server = null
})
