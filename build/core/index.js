'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaPug = require('koa-pug');

var _koaPug2 = _interopRequireDefault(_koaPug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koaError = require('koa-error');

var _koaError2 = _interopRequireDefault(_koaError);

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _koaStylus = require('koa-stylus');

var _koaStylus2 = _interopRequireDefault(_koaStylus);

var _koutoSwiss = require('kouto-swiss');

var _koutoSwiss2 = _interopRequireDefault(_koutoSwiss);

var _jeet = require('jeet');

var _jeet2 = _interopRequireDefault(_jeet);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaWebpack = require('koa-webpack');

var _koaWebpack2 = _interopRequireDefault(_koaWebpack);

var _webpack = require('./webpack.config');

var _webpack2 = _interopRequireDefault(_webpack);

var _utils = require('./utils');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var app, debug, errorEnv, global_locals_for_all_pages, logger, loggerOpts, pug, softRouter, stylusCompile, topRouter, viewPath;

debug = (0, _debug2.default)('core');

app = new _koa2.default();

topRouter = new _koaRouter2.default();

if (_utils.inProd) {
  // This tells the default error handler to not log any thrown middleware error
  // to the console. It has no effect if your own middleware handles all errors.
  app.silent = true;
}

if (!_utils.inProd) {
  errorEnv = 'development';
} else {
  errorEnv = 'production';
}

app.use((0, _koaError2.default)({
  engine: 'pug',
  template: _path2.default.join(__dirname, '../views/error.pug'),
  env: errorEnv
}));

// Basic error handler that logs any errors to console.
// This must be 'used' before any middleware that may throw errors to ensure it
// catches them.
//app.use (ctx, next) =>
//try
//await next()
//catch err
//console.log err
//ctx.body = 'caught an error'

//app.use (ctx, next) =>
//try
//await next()
//catch err
//console.log err
//ctx.body = 'caught an error'
loggerOpts = {};

if (_utils.inProd) {
  loggerOpts.logReq = true;
  loggerOpts.logErr = true;
} else {
  loggerOpts.logReq = false;
}

logger = (0, _logger2.default)(loggerOpts);

app.use(logger);

viewPath = _path2.default.join(__dirname, '../views');

global_locals_for_all_pages = {
  title: 'Koa Template',
  router: topRouter
};

pug = new _koaPug2.default({
  viewPath: viewPath,
  basedir: viewPath,
  cache: !process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
  pretty: process.env.NODE_ENV === 'development',
  compileDebug: process.env.NODE_ENV === 'development',
  locals: global_locals_for_all_pages,
  //helperPath: [
  //'path/to/pug/helpers',
  //{ random: 'path/to/lib/random.js' },
  //{ _: require('lodash') }
  //],
  app: app // equals to pug.use(app) and app.use(pug.middleware)
});

if (!_utils.inProd) {
  stylusCompile = function stylusCompile(str, path) {
    return (0, _stylus2.default)(str).set('filename', path).set('compress', false).use((0, _koutoSwiss2.default)()).use((0, _jeet2.default)());
  };
  app.use((0, _koaStylus2.default)({
    src: _path2.default.join(__dirname, '../assets'),
    dest: _path2.default.join(__dirname, '../public'),
    compile: stylusCompile
  }));
}

if (!_utils.inProd) {
  app.use((0, _koaWebpack2.default)({
    config: (0, _webpack2.default)('development')
  }));
}

app.use((0, _koaStatic2.default)(_path2.default.join(__dirname, '../public')));

// Test middleware that does nothing but throw an error.
// This has no effect if it’s used after any routes are used.
//app.use (ctx, next) =>
//#throw new Error 'Fake Error'
//ctx.throw 500, 'Fake Error'

// An example of adding a variable that will show up in the template context for
// everything under this router. bodyClasses will also show up in the template
// contexts for every router nested under topRouter.
topRouter.use(function (ctx, next) {
  ctx.state.bodyClasses = '';
  return next();
});

topRouter.get('home', '/', function (ctx, next) {
  var locals;
  locals = {
    title: 'Jonathan MᶜClare'
  };
  //subHeading: 'A template for a Node.js Koa site'
  return ctx.render('home', locals, true);
});

softRouter = new _koaRouter2.default();

topRouter.use(function (ctx, next) {
  ctx.state.bodyClasses = 'software';
  return next();
});

softRouter.get('software', '/', function (ctx, next) {
  var locals;
  locals = {
    title: 'Software Development'
  };
  //subHeading: 'A React app that simulates investment growth and returns over time.'
  return ctx.render('software/main', locals, true);
});

softRouter.get('software-icalc', '/investment-calc', function (ctx, next) {
  var locals;
  locals = {
    title: 'Investment Calculator',
    subHeading: 'A React app that simulates investment growth and returns over time.'
  };
  return ctx.render('software/icalc', locals, true);
});

topRouter.use('/software', softRouter.routes(), softRouter.allowedMethods());

app.use(topRouter.routes()).use(topRouter.allowedMethods());

// This must come after the routes to only catch unhandled requests.
app.use(async function (ctx, next) {
  var locals;
  ctx.response.status = 404;
  ctx.response.message = 'Not Found';
  await next();
  if (ctx.request.accepts('html')) {
    locals = {
      title: 'Page Not Found'
    };
    return ctx.render('404', locals, true);
  }
  if (ctx.request.accepts('json')) {
    ctx.body = {
      message: 'Not Found'
    };
    return;
  }
  // default to plain text
  return ctx.body = 'Not Found';
});

// A makeshift error event handler middleware.
// This can be defined anywhere after the app object is created.
//app.on 'error', (err, ctx) =>
//#log.error('server error', err, ctx)
//console.log 'stuff'
//console.log err
exports.default = app;