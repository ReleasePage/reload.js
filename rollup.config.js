import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
  entry: './reload.js',
  dest: pkg.main,
  moduleName: 'Reload',
  format: 'iife',
  plugins: [
    nodeResolve({
      main: true,
      jsnext: true,
      browser: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
