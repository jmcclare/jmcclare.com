// This is a harness to let Mocha run the tests without choking on CoffeeScript
// 2’s ES2015+ output.

// We pass options to `require` that `coffeescript/register` will respond to.
require('module').prototype.options = {transpile: {presets: ['es2015']}}

require('coffeescript/register')

require('./test')
