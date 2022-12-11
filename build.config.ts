import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  replace: {
    'import.meta.vitest': 'undefined',
  },
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
