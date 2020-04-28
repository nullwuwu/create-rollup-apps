// import babel from 'rollup-plugin-babel';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
<% if (isTypeScript) { -%>
  import typescript from '@rollup/plugin-typescript';
<% }-%>

const config = {
  input: <% if (isTypeScript) { %>'src/index.ts'<% } else { %>'src/index.js' <% } %>,
  output: [
    {
      file: 'build/index.js',
      format: 'umd',
      name: '111',
    },
    {
      file: 'build/index.cjs.js',
      format: 'cjs',
      name: '111',
    },
    {
      file: 'build/index.esm.js',
      format: 'es',
    },
  ],
  plugins: [
    alias({
      entries: {
        '@': './src',
      },
    }),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      preferBuiltins: true,
      browser: true,
      modulesOnly: true,
    }),
    commonjs(),
    buble(),
    builtins(),
    terser(),
    filesize(),
    <% if (isTypeScript) { -%>
        typescript(),
    <% }-%>
  ],
};

export default config;
