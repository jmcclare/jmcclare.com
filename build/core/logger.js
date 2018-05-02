'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var debug, formatDate, logError, logRequest, loggerSetup;

debug = (0, _debug2.default)('logger');

formatDate = function formatDate(date) {
  var includeTZ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var months, time, tzHours, tzMins, tzOffset;
  // Build an NGinX formatted date string.
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  tzHours = Math.trunc(date.getTimezoneOffset() / 60);
  tzMins = date.getTimezoneOffset() - tzHours * 60;
  tzOffset = '-' + tzHours.toString().padStart(2, 0) + ('' + tzMins.toString().padStart(2, 0));
  time = date.getDate() + '/' + months[date.getMonth()] + '/' + date.getUTCFullYear() + (':' + date.getHours().toString().padStart(2, 0)) + (':' + date.getMinutes().toString().padStart(2, 0)) + (':' + date.getSeconds().toString().padStart(2, 0));
  if (includeTZ) {
    time += ' ' + tzOffset;
  }
  return time;
};

logRequest = function logRequest(ctx, ct) {
  var ip, time;
  if (!ct) {
    ct = new Date();
  }
  ip = ctx.ip.replace(/::ffff:/, '');
  time = formatDate(ct, true);
  // Log an NginX formatted request / response entry
  return console.log(ip + ' - - [' + time + '] "' + ctx.method + ' ' + ctx.path + ' HTTP/1.1"' + (' ' + ctx.status + ' ' + ctx.length + ' ') + ('"' + ctx.protocol + '://' + ctx.host + ctx.url + '"') + (' "' + ctx.header['user-agent'] + '"'));
};

logError = function logError(ctx, err, ct) {
  var entry, ip, time;
  if (!ct) {
    ct = new Date();
  }
  ip = ctx.ip.replace(/::ffff:/, '');
  time = formatDate(ct, false);
  // Log an NginX formatted error entry to stderr
  entry = time + ' [error] ' + process.pid + '#0 "' + ctx.path + '"';
  if (err.message) {
    entry += ' ' + err.message;
  }
  entry += ', client: ' + ip + ', server: ' + ctx.hostname + (', request: "' + ctx.method + ' ' + ctx.path + ' HTTP/1.1"') + (', host: "' + ctx.host + '"');
  return console.error(entry);
};

loggerSetup = function loggerSetup() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var logErr, logReq;
  if (options.logErr === void 0) {
    logErr = false;
  } else {
    logErr = options.logErr;
  }
  if (options.logReq === void 0) {
    logReq = true;
  } else {
    logReq = options.logReq;
  }
  return async function (ctx, next) {
    var ct, err;
    ct = new Date();
    try {
      await next();
    } catch (error) {
      err = error;
      if (logReq) {
        logRequest(ctx, ct);
      }
      if (logErr) {
        logError(ctx, err, ct);
      }
      throw err;
    }
    if (logReq) {
      return logRequest(ctx, ct);
    }
  };
};

exports.default = loggerSetup;