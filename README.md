# koa-template #

Template for a Node.js [Koa 2](http://koajs.com/) website.

Features:

* full [CoffeeScript](http://coffeescript.org/) 2 ES2015 (ES6) features through Babel
* [React](https://reactjs.org/) UI framework with support for [JSX](https://reactjs.org/docs/introducing-jsx.html)
* integrated tests with [Mocha](https://mochajs.org/) and [Supertest](https://github.com/visionmedia/supertest)
* continuous, incremental builds with [Gulp](https://gulpjs.com/) and [Webpack](https://webpack.js.org/)
* [Pug](https://pugjs.org/api/getting-started.html) templating system
* main Pug template and other features based on [HTML5 Boilerplate](https://html5boilerplate.com/)
* [Stylus](http://stylus-lang.com/) CSS preprocessor
  - [kouto-swiss](http://kouto-swiss.io/) Stylus framework
  - [Jeet](https://jeet.gs/) Stylus grid system
* [Font Awesome](https://fontawesome.com/) icon font
* Proper error and 404 handlers
* Production logging middleware

Check out a [live demo](http://koa-template.jmcclare.com/).


## Installation ##

Install Node, npm and coffeescript and have them available on your path.

Clone this repository and re‐initialize it as a new Git repository.

    git clone https://github.com/jmcclare/koa-template yourprojectname
    cd yourprojectname
    rm -rf .git
    git init .


## Running The Site ##

Run the site in development mode with:

    npm start

This will run the site at `http://localhost:3000`

Set the port the site runs under on the command line with `PORT=<port-number>`.
For example, to run the site under port 9966, run

    PORT=9966 npm start

`npm start` runs the site in development mode. It also monitors the directory
for changes and restarts the Node server whenever it detects any. Run this
while you’re working.

In production, run the site with:

    NODE_PATH=/path/to/app/build/lib:/path/to/app/build/site_modules:$NODE_PATH PORT=9966 /path/to/node /path/to/app/build

`/path/to/node` is the path to your `node` executable. Set the `PORT` to
whatever you need in production.

`/path/to/app/build/site_modules` is the path to the `site_modules` directory
inside the `build` directory. This needs to be in the `NODE_PATH` so that those
modules can be imported by name like the ones in `node_modules`.

In production it’s better to use `node` directly instead of our `npm` script,
but you can also test the site out in production mode with:

    npm run start-prod


## Building The Production Version of the Site ##

The files you work on and test are the development files. The version of the
site you run in production is the one in the `build` directory—the build. To
update the build, run:

    npm run build

To flush out any unneeded files and do a fresh build, run:

    npm run clean; npm run build

You should do that whenever you delete or rename a `.coffee` file.

While you are working, you should keep the continuous, incremental build
running in the background to keep the build updated for you. Run that with `npm
run cont-build`


## Testing The Site ##

Run the site’s integrated tests with:

    npm test

The test runner will stay open and automatically re‐run every time it detects
changes in the development files.

Integrated tests are in the `test` directory.

To test the production build, run:

    npm run test-prod

If the tests are all passing in regular development mode these ones should all
pass too, but it’s good to make sure nothing went wrong while creating the
build.


## Developing Your Site ##

There is a quick command you can use during development to run both the
development server and the continuous build. Keep this running in the
background while you are working:

    npm run dev

Add routes, middleware, and any back‐end CoffeeScript code in `core`. There are
some sample routes there to show you how to get started.

The pug templates are in `views`. You should have all templates extend
`layout.pug`. Edit or remove the sample templates as you see fit.

Edit the Stylus CSS preprocessor files in `assets/_css`. These will be compiled
and placed in `public/_css`. You can also add regular CSS library files to
`public/_css` and either import them in your main `style.styl` or link them in
your Pug template.

Edit the front end CoffeeScript files in `assets/_js`. `site.coffee` is the
entry point for your front end CoffeeScript. Make sure this imports everything
else you are using. `site.coffee` and everything imported by it will be
compiled into `public/_js/site.js`.

Edit the front end React JSX files in `assets/_js`. `react-app.jsx` is the
entry point for your main React app. You can import anything else you need from
there. `react-app.jsx` and everything imported by it will be compiled into
`public/_js/react-app.js`.

If you want to have multiple separate CoffeeScript or React JSX apps to run in
different parts of your site you will have to add more entry points for them to
`core/webpack.conf.coffee`, `gulpfile.coffee` and link to them in whatever
template will use them in `views`.

You can place any files to be served statically in `public`. Use the
appropriate sub‐directory though. Only things like `favicon.ico`, `robots.txt`,
and `humans.txt` need to go in the root of `public`.

Put your integrated site‐wide tests in `test`. Make sure to import your test
files in `test/index.coffee`.

### Site Modules ###

There are a few sample site modules in the `site_modules` directory.

The `site_modules` directory is added to the `NODE_PATH` by all of the scripts
in `package.json`. That means you can import any of the site modules by name in
your back end CoffeeScript code. Make sure you also add `site_modules` to the
`NODE_PATH` when you are running in production as well.

For files that need to be in `assets`, `public`, `test`, or `views`, you need
to either symlink (preferred) or copy them into their main app directory. Views
often need to be copied because you need to customize their markup for the site
you are using the module in.

You can give instructions on exactly what needs to be symlinked or copied where
in your site module’s README, but here is the general best practice.

Let’s assume you have a site module named `dummy-module` in your `site_modules`
directory. Here is its directory layout.

    site_modules/
      dummy-module/
        assets/
          _css/
            index.styl/
            component.styl/
          _js/
            index.jsx/
            component.jsx/
        public/
          _img/
            dummy-icon.png/
        test/
          index.coffee/
          subset.coffee/
        views/
          list.pug/
          detail.pug/

You should design your site module so that all of the directories for these
files are symlinked into their main app directories as `dummy-module`.

For CSS (Stylus `.styl` files) `site_modules/dummy-modle/assets/_css` will be
symlnked to `assets/_css/dummy-module`. You will import the `index.styl` from
`assets/_css/site.styl` with `@import './dummy-module'`.

You will do the same for the other types of resources. Here is where you would
create symlinks in the main app directory.

    assets/
      _css/
        dummy-module/
      _js/
        dummy-module/
    public/
      _img/
        dummy-module/
    test/
      dummy-module/
    views/
      dummy-module/

This keeps the files for each site module separate, easy to update (via
symlinks) and easy to remove.

If your site module needs Node packages that are not used in the default site
template, nor by any other site modules, you can keep a separate `package.json`
and `node_modules` directory in the site module’s directory.
