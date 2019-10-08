import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: {
    'dist/index': 'src/index.js',
    'styled/dist/index': 'styled/src/index.js',
  },
  output: {
    dir: '.',
    format: process.env.format || 'esm',
    chunkFileNames: 'lib/dist/common-[hash].[format].js',
    entryFileNames: '[name].[format].js',
  },
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    process.env.NODE_ENV === 'production' && terser(), // minifies generated bundles
  ],
}
