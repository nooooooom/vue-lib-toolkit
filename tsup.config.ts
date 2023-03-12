import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/index.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  externals: ['vue', 'vue-module-demi'],
  dts: true
}
