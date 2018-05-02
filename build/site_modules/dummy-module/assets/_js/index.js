'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var logsNonsense;

logsNonsense = function logsNonsense() {
  return console.log('nonsense from inside dummy-module index.coffee');
};

exports.default = logsNonsense;