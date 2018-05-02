import path from 'path'
import url from 'url'
import coffeeScript from 'coffeescript'
import coffeeHelpers from 'coffeescript/lib/coffeescript/helpers'
updateSyntaxError = coffeeHelpers.updateSyntaxError
import fs from 'fs'


mwGenerator = (opt) ->
  if !opt.src
    throw new Error('You should specify the source directory (src) for koa-coffeescript')

  if !opt.dst
    opt.dst = opt.src

  if !opt.compileOpt
    opt.compileOpt = {}


  compile = (ctx, opt) =>
    new Promise (resolve, reject) =>
      pathname = url.parse(ctx.url).pathname
      #console.log "ctx.url: #{ctx.url}"
      if /\.js$/.test(pathname)
        compiledFilePath = path.join(opt.dst, pathname)
        filePath = compiledFilePath.replace(/\.js$/, '.coffee')
        filePath = filePath.replace(opt.dst, opt.src)

        # Compare the file modification times.
        fs.stat filePath, (err, fileStat) =>
          #console.log "filePath: #{filePath}"
          if err
            #console.log "fs.stat error with #{filePath}: #{err.code}"
            if err.code == 'ENOENT'
              # No matching .coffee file in the src directory for this .js file.
              # Nothing needs to be done here.
              #console.log 'source .coffee file does not exist'
              return resolve()
            else
              return reject err

          fs.stat compiledFilePath, (err, compFileStat) =>
            if err
              #console.log "fs.stat error with #{compiledFilePath}: #{err.code}"
              if err.code == 'ENOENT'
                # Compiled .js file does not exist yet. No need to compare times.
                # Do the compilation..
                #console.log "compiled file #{compiledFilePath} does not exit yet, compiling..."
                return doCompile filePath, compiledFilePath, opt, (err) =>
                  if err
                    return reject err
                  return resolve()
              else
                return reject err

            if fileStat.mtime > compFileStat.mtime
              #console.log "source file file #{filePath} is newer than #{compiledFilePath}. Compiling..."
              # The source file is newer than the compiled .js file. Do the
              # compilation.
              return doCompile filePath, compiledFilePath, opt, (err) =>
                if err
                  return reject err
                return resolve()
            else
              #console.log "source file file #{filePath} is not newer than #{compiledFilePath}. Skipping compilation."
              return resolve()

      else
        #return cb()
        return resolve()


    # This final step where we actually perform the compilation, after verifying
    # that we need to.
    doCompile = (filePath, compiledFilePath, opt, cb) ->
      fs.readFile filePath, 'utf8', (err, file) ->
        if err
          return cb err

        try
          compiledFile = coffeeScript.compile(file, opt.compileOpt)
        catch err
          updateSyntaxError(err, null, filePath)
          return cb err

        #console.log "finished compiling #{compiledFilePath}. No errors."
        fs.writeFile compiledFilePath, compiledFile, 'utf8', (err) ->
          if err
            return cb err
          return cb()
    return

  return (ctx, next) ->
    await compile ctx, opt
    await next()
    return


export default mwGenerator
