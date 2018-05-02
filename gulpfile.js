// This is a harness to let Gulp run the gulpfile without choking on
// CoffeeScript 2’s ES2015+ output.

// We pass options to `require` that `coffeescript/register` will respond to.
require('module').prototype.options = {transpile: {presets: ['es2015']}}

require('coffeescript/register')

require('./gulpfile.coffee')
