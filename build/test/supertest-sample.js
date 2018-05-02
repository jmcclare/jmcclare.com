'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _core = require('../core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var server;

// Declare an empty server object in this scope so the before and after methods
// below can both access it for starting and stopping.
server = {};

describe('home page', function () {
  before(function () {
    return server = _core2.default.listen();
  });
  after(function () {
    return server.close();
  });
  it('responds with text', function (done) {
    (0, _supertest2.default)(server).get('/').expect('Content-Type', /text/).expect(200, function (err, res) {
      if (err) {
        return done(err);
      }
      res.should.be.html;
      (0, _assert2.default)(res.text.indexOf('<title>Home Page') !== -1);
      return done();
    });
  });
  // Now with a promise. I put the return in explicitly to demonstrate what’s
  // going on. CoffeeScript would have put it in anyway though.
  // Add a blank return so that CoffeeScript doesn’t put one in front of the
  // request call. That confuses Mocha. If you put a `return` in front of the
  // call to `request` Mocha assumes you are giving it a promise.
  return it('responds with text again', function () {
    return (0, _supertest2.default)(server).get('/').expect(200).then(function (res) {
      return (0, _assert2.default)(res.text.indexOf('<title>Home Page') !== -1);
    });
  });
});