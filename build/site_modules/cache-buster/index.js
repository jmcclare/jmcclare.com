'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var CacheBuster, debug;

debug = (0, _debug2.default)('cachebuster');

CacheBuster = function () {
  function CacheBuster(staticDir) {
    _classCallCheck(this, CacheBuster);

    this.staticDir = staticDir;
    this.cachedIDs = {};
    // Pug needs to be able to call these class methods without referencing the
    // object instance after we pass them as filter methods.
    this.getID = this.getID.bind(this);
    this.url = this.url.bind(this);
    this.pugLinkFilter = this.pugLinkFilter.bind(this);
  }

  _createClass(CacheBuster, [{
    key: 'getID',
    value: function getID(pubPath) {
      var err, fullPath, id, stats;
      if (this.cachedIDs[pubPath]) {
        debug('Found cached ID: ' + this.cachedIDs[pubPath]);
        return this.cachedIDs[pubPath];
      } else {
        // Get the file’s mtime.
        fullPath = _path2.default.join(this.staticDir, pubPath);
        debug('Looking up mtime for ' + pubPath);
        try {
          stats = _fs2.default.statSync(fullPath);
        } catch (error) {
          err = error;
          debug('Error looking up mtime for ' + pubPath);
          debug(err.toString());
          // Sub in an object with the current time so that it doesn’t try to
          // access the file on every request.
          stats = {
            mtime: new Date()
          };
        }
        debug('file mtime: ' + stats.mtime);
        id = stats.mtime.getTime();
        this.cachedIDs[pubPath] = id;
        return id;
      }
    }
  }, {
    key: 'url',
    value: function url(pubPath) {
      var id;
      debug('Getting cachebuster ID for ' + pubPath);
      id = this.getID(pubPath);
      debug('Fetched cachebuster ID: ' + id + ' for ' + pubPath);
      return pubPath + '?v=' + id;
    }
  }, {
    key: 'pugLinkFilter',
    value: function pugLinkFilter(text, options) {
      var id, tag;
      // TODO: iterate over all options and include them as tag parameters.
      tag = '<link ';
      if (options.rel) {
        tag += ' rel="' + options.rel + '"';
      }
      if (options.type) {
        tag += ' type="' + options.type + '" ';
      }
      if (options.href) {
        id = this.getID(options.href);
        tag += ' href="' + options.href + '?v=' + id + '"';
      }
      tag += ' />';
      return tag;
    }
  }]);

  return CacheBuster;
}();

exports.default = CacheBuster;