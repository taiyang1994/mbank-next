import path from 'path';
import alias from 'rollup-plugin-alias';
import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import buble from 'rollup-plugin-buble';
import bundleSize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import url from 'rollup-plugin-url';
import autoprefixer from 'autoprefixer';
import {uglify} from 'rollup-plugin-uglify';
import pkg from './package.json';
const external = Object.keys(pkg.dependencies);
const isProduction = !process.env.ROLLUP_WATCH;
const globals = {vue: 'Vue', mand: 'Mand'};

const plugins = [
  resolve({
    extensions: ['.js', '.vue']
  }),
  alias({
    '@': path.join(__dirname, 'src'),
    '@mand-mobile': path.join(__dirname, 'src/components/mand-mobile/modules')
  }),
  postcss(),
  vue({
    template: {
      isProduction,
      compilerOptions: {preserveWhitespace: true}
    },
    style: {
      postcssPlugins: [
        autoprefixer()
      ]
    },
    css: true
  }),
  json({
    exclude: [
      'node_modules/**'
    ]
  }),
  url({
    limit: 30 * 1024,
    include: [
      '**/*.mp3'
    ]
  }),
  babel({
    exclude: [
      'node_modules/**'
    ],
    runtimeHelpers: true,
    extensions: ['.js', '.vue']
  }),
  nodeGlobals(),
  bundleSize(),
  commonjs(),
  buble()
];

const uglifyPlugin = uglify({
  output: {
    wrap_iife: true
  },
  mangle: {
    reserved: ['define', 'require']
  }
});

function main() {
  const input = path.resolve(__dirname, 'src/components/entry.js');
  const output = {
    globals,
    format: 'umd',
    name: 'imperfections',
    intro: `
      var emptyDefine = function (f) {
        f(function () {});
      };
      var cmdDefine = window.define || emptyDefine;
      if (typeof seajs !== "undefined" && seajs.data.base === seajs.data.dir) {
        cmdDefine = emptyDefine;
      }
      cmdDefine(function (require) {
        
        require("../common/vue");
        Vue = Vue || window.Vue;
    `,
    outro: '});'
  };

  return [
    {
      external,
      input,
      plugins: [...plugins, uglifyPlugin],
      output: {...output, file: './../js/mbank-next-ui/index.js'}
    },
    {
      external,
      input,
      plugins: [...plugins],
      output: {...output, file: './../js/mbank-next-ui/index.unzipped.js'}
    }
  ];
}

export default main();
