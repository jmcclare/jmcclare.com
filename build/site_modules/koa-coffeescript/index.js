'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _coffeescript = require('coffeescript');

var _coffeescript2 = _interopRequireDefault(_coffeescript);

var _helpers = require('coffeescript/lib/coffeescript/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var mwGenerator, updateSyntaxError;

updateSyntaxError = _helpers2.default.updateSyntaxError;

mwGenerator = function mwGenerator(opt) {
  var compile;
  if (!opt.src) {
    throw new Error('You should specify the source directory (src) for koa-coffeescript');
  }
  if (!opt.dst) {
    opt.dst = opt.src;
  }
  if (!opt.compileOpt) {
    opt.compileOpt = {};
  }
  compile = function compile(ctx, opt) {
    var doCompile;
    new Promise(function (resolve, reject) {
      var compiledFilePath, filePath, pathname;
      pathname = _url2.default.parse(ctx.url).pathname;
      //console.log "ctx.url: #{ctx.url}"
      if (/\.js$/.test(pathname)) {
        compiledFilePath = _path2.default.join(opt.dst, pathname);
        filePath = compiledFilePath.replace(/\.js$/, '.coffee');
        filePath = filePath.replace(opt.dst, opt.src);
        // Compare the file modification times.
        return _fs2.default.stat(filePath, function (err, fileStat) {
          //console.log "filePath: #{filePath}"
          if (err) {
            //console.log "fs.stat error with #{filePath}: #{err.code}"
            if (err.code === 'ENOENT') {
              // No matching .coffee file in the src directory for this .js file.
              // Nothing needs to be done here.
              //console.log 'source .coffee file does not exist'
              return resolve();
            } else {
              return reject(err);
            }
          }
          return _fs2.default.stat(compiledFilePath, function (err, compFileStat) {
            if (err) {
              //console.log "fs.stat error with #{compiledFilePath}: #{err.code}"
              if (err.code === 'ENOENT') {
                // Compiled .js file does not exist yet. No need to compare times.
                // Do the compilation..
                //console.log "compiled file #{compiledFilePath} does not exit yet, compiling..."
                return doCompile(filePath, compiledFilePath, opt, function (err) {
                  if (err) {
                    return reject(err);
                  }
                  return resolve();
                });
              } else {
                return reject(err);
              }
            }
            if (fileStat.mtime > compFileStat.mtime) {
              //console.log "source file file #{filePath} is newer than #{compiledFilePath}. Compiling..."
              // The source file is newer than the compiled .js file. Do the
              // compilation.
              return doCompile(filePath, compiledFilePath, opt, function (err) {
                if (err) {
                  return reject(err);
                }
                return resolve();
              });
            } else {
              //console.log "source file file #{filePath} is not newer than #{compiledFilePath}. Skipping compilation."
              return resolve();
            }
          });
        });
      } else {
        //return cb()
        return resolve();
      }
    });
    // This final step where we actually perform the compilation, after verifying
    // that we need to.
    doCompile = function doCompile(filePath, compiledFilePath, opt, cb) {
      return _fs2.default.readFile(filePath, 'utf8', function (err, file) {
        var compiledFile;
        if (err) {
          return cb(err);
        }
        try {
          compiledFile = _coffeescript2.default.compile(file, opt.compileOpt);
        } catch (error) {
          err = error;
          updateSyntaxError(err, null, filePath);
          return cb(err);
        }
        //console.log "finished compiling #{compiledFilePath}. No errors."
        return _fs2.default.writeFile(compiledFilePath, compiledFile, 'utf8', function (err) {
          if (err) {
            return cb(err);
          }
          return cb();
        });
      });
    };
  };
  return async function (ctx, next) {
    await compile(ctx, opt);
    await next();
  };
};

exports.default = mwGenerator;