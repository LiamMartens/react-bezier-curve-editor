const fs = require('fs');
const path = require('path');
const ts = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');

module.exports = {
  input: path.join(__dirname, 'src/index.ts'),
  output: {
    file: path.join(__dirname, 'lib/index.js'),
    format: 'commonjs'
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    postcss({
      modules: true,
    }),
    babel({
      presets: [
        [
          '@babel/preset-env',
          {
            corejs: 3,
            useBuiltIns: 'entry',
            targets: {
              browsers: ['last 2 versions']
            }
          }
        ]
      ],
      babelHelpers: 'bundled'
    }),
    ts()
  ]
};