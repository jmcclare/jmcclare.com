# koa-coffeescript #

A CoffeeScript compiler middleware for Koa 2. Use this to compile your
front‐end CoffeeScript files into JavaScript on the fly during development.

This middleware shouldn’t cause any major problems in production though. After
a `.coffee` file has been compiled into a `.js` file subsequent requests for it
will only check the modification times of both files.

Based on [koa-coffee-script](https://github.com/evansdiy/koa-coffee-script).

koa-coffeescript is an update of koa-coffee-script that also lets you pass
options to the CoffeeScript compiler.


## Caveats ##

For production you should ideally compile your front‐end CoffeeScript into
JavaScript beforehand and not run this middleware at all. You should also be
serving static files like your front‐end `.js` files using a more efficient
file server like NginX. koa-coffeescript is only meant to be used during
development.

For some reason I could not track down, you need to refresh your browser twice
for changes in a compiled JavaScript file to show up. A newly compiled file
should be written to disk before the static file server hands it to the browser
(assuming you follow the guide below and place it after koa-coffeescript in the
middleware stack), but the browser doesn’t get it until you do another page
reload. I found that [webpack](https://webpack.js.org/) doesn’t have this
problem.

The largest caveat is that this CoffeeScript compiler does not support
importing other CoffeeScript files or modules in any way. It will not combine
them with the compiled JavaScript file. You have to either place all of your
front end CoffeeScript code into the file you are linking to, or setup separate
linked files for everything you are using and make sure their features are
accessible in the browser through global variables. This is the biggest thing
that limits the usefulness of this middleware and the reason I switched to
webpack. This site module is here for reference only.


## Installation ##

Place the `koa-coffeescript` directory somewhere on your `NODE_PATH`. Unless
you have compiled this to JavaScript already your project will have to be
running under CoffeeScript to import and use it.

Install dependencies:

    npm install --save babel-core babel-preset-es2015


## Usage ##

Assume you have the following basic project layout.

    app
      index.coffee
      assets
      public
      views
        layout.pug
        home.pug

In `index.coffee`:

    import Koa from 'koa'
    import serve from 'koa-static'
    import coffee from 'koa-coffeescript'

    app = new Koa()

    app.use coffee
      src: path.join __dirname, 'assets'
      dst: path.join __dirname, 'public'
      compileOpt:
        bare: true
        transpile:
          presets: 'es2015'

    # Your static file serving middleware must come after the CoffeeScript
    compiler.
    app.use serve path.join __dirname, 'public'

Assuming `__dirname` is the root of your project, this will look for `.coffee`
files in your `assets` directory and compile each of them to a JavaScript file
in the same place under your `public` directory.

In your template, link to the `.js` file that will be generated and
koa-coffeescript will make sure it gets generated.

For example, in a Pug template, to serve the JavaScript for
`assets/_js/site.coffee`, add this script tag.

    script(src="/_js/site.js")

The `compileOpt` sub‐object is options that are passed directly to the
CoffeeScript compiler. In this example we are setting `bare`, which tells it to
not put the CoffeeScript code in a wrapper function. The `transpile` option
tells it to transpile the resulting JavaScript code using Babel. `presets:
'es2015'` is the options object CoffeeScript will pass to Babel.
