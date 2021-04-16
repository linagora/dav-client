import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

export default {
  input: 'lib/index.ts',
  output: {
    file: pkg.main,
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      declaration: true,
      declarationDir: '.',
      tsconfig: './tsconfig.json'
    }),
    terser()
  ]
};
