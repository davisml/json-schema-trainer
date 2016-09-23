require("babel-register")({
  presets: ["babel-preset-es2015"],
  plugins: ["syntax-async-functions", "transform-regenerator"]
})

require('babel-polyfill')
require('./src/test.js')