import debugMod from 'debug'
debug = debugMod 'core'
import Koa from 'koa'
import Router from 'koa-router'
import Pug from 'koa-pug'
import path from 'path'
import error from 'koa-error'

import stylus from 'stylus'
import kStylus from 'koa-stylus'
import kswiss from 'kouto-swiss'
import jeet from 'jeet'
import serve from 'koa-static'
import webpack from 'koa-webpack'
import webpackConfig from './webpack.config'
import { inProd } from './utils'
import loggerSetup from './logger'


app = new Koa()
topRouter = new Router()


if inProd
  # This tells the default error handler to not log any thrown middleware error
  # to the console. It has no effect if your own middleware handles all errors.
  app.silent = true


if ! inProd
  errorEnv = 'development'
else
  errorEnv = 'production'
app.use error
  engine: 'pug',
  template: path.join __dirname, '../views/error.pug'
  env: errorEnv


# Basic error handler that logs any errors to console.
# This must be 'used' before any middleware that may throw errors to ensure it
# catches them.
#app.use (ctx, next) =>
  #try
    #await next()
  #catch err
    #console.log err
    #ctx.body = 'caught an error'

#app.use (ctx, next) =>
  #try
    #await next()
  #catch err
    #console.log err
    #ctx.body = 'caught an error'

loggerOpts = {}
if inProd
  loggerOpts.logReq = true
  loggerOpts.logErr = true
else
  loggerOpts.logReq = false
logger = loggerSetup loggerOpts
app.use logger


viewPath = path.join __dirname, '../views'
global_locals_for_all_pages =
  title: 'Koa Template'
  router: topRouter

pug = new Pug
  viewPath: viewPath,
  basedir: viewPath,
  cache: ! process.env.NODE_ENV == 'development',
  debug: process.env.NODE_ENV == 'development',
  pretty: process.env.NODE_ENV == 'development',
  compileDebug: process.env.NODE_ENV == 'development',
  locals: global_locals_for_all_pages,
  #helperPath: [
    #'path/to/pug/helpers',
    #{ random: 'path/to/lib/random.js' },
    #{ _: require('lodash') }
  #],
  app: app # equals to pug.use(app) and app.use(pug.middleware)


# We only use stylus here in development mode. In production the .styl files
# will already be compiled into .css and stored in the pubic directory.
if ! inProd
  stylusCompile = (str, path) ->
    return stylus(str)
      .set('filename', path)
      .set('compress', false)
      .use(kswiss())
      .use(jeet())
  app.use kStylus
    src: path.join __dirname, '../assets'
    dest: path.join __dirname, '../public'
    compile: stylusCompile

# Webpack handles on the fly compiling of front end .coffee, .js, and .jsx
# files (in the _assets/_js dir).
#
# This is only used in development or regular development test mode. In
# production, these files will be precompiled into JavaScript files by Gulp
# using webpack.
if ! inProd
  app.use webpack config: webpackConfig 'development'

app.use serve path.join __dirname, '../public'


# Test middleware that does nothing but throw an error.
# This has no effect if it’s used after any routes are used.
#app.use (ctx, next) =>
  ##throw new Error 'Fake Error'
  #ctx.throw 500, 'Fake Error'
  #


# An example of adding a variable that will show up in the template context for
# everything under this router. bodyClasses will also show up in the template
# contexts for every router nested under topRouter.
topRouter.use (ctx, next) =>
  ctx.state.bodyClasses = ''
  return next()

topRouter.get 'home', '/', (ctx, next) =>
  locals =
    title: 'Jonathan MᶜClare'
    subHeading: 'A hub for what I’m up to online'
  ctx.render 'home', locals, true


softRouter = new Router()

topRouter.use (ctx, next) =>
  ctx.state.bodyClasses = 'software'
  return next()

softRouter.get 'software', '/', (ctx, next) =>
  locals =
    title: 'Software Development'
    subHeading: 'Some projects I’m able to share'
  ctx.render 'software/main', locals, true

softRouter.get 'software-icalc', '/investment-calc', (ctx, next) =>
  locals =
    title: 'Investment Calculator'
    subHeading: 'A React app that simulates investment growth and returns over time.'
  ctx.render 'software/icalc', locals, true

topRouter.use '/software', softRouter.routes(), softRouter.allowedMethods()


app
  .use(topRouter.routes())
  .use(topRouter.allowedMethods())


# This must come after the routes to only catch unhandled requests.
app.use (ctx, next) =>
  ctx.response.status = 404
  ctx.response.message = 'Not Found'
  await next()

  if ctx.request.accepts 'html'
    locals =
      title: 'Page Not Found'
    return ctx.render '404', locals, true

  if ctx.request.accepts 'json'
    ctx.body = { message: 'Not Found' }
    return

  # default to plain text
  ctx.body = 'Not Found'


# A makeshift error event handler middleware.
# This can be defined anywhere after the app object is created.
#app.on 'error', (err, ctx) =>
  ##log.error('server error', err, ctx)
  #console.log 'stuff'
  #console.log err


export default app
