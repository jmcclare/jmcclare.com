'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var port, server;

if (!module.parent) {
  port = process.env.PORT || 3000;
  server = _core2.default.listen(port, function () {
    return console.log('server started at port ' + port);
  });
}

exports.default = _core2.default;