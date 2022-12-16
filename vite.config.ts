import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    deps: {
      fallbackCJS: true,
    },
  },
})
