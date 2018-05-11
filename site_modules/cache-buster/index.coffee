import debugMod from 'debug'
debug = debugMod 'cachebuster'
import path from 'path'
import fs from 'fs'


class CacheBuster
  constructor: (@staticDir) ->
    @cachedIDs = {}

    # Pug needs to be able to call these class methods without referencing the
    # object instance after we pass them as filter methods.
    this.getID = this.getID.bind this
    this.url = this.url.bind this
    this.pugLinkFilter = this.pugLinkFilter.bind this


  getID: (pubPath) ->
    if @cachedIDs[pubPath]
      debug "Found cached ID: #{@cachedIDs[pubPath]}"
      return @cachedIDs[pubPath]
    else
      # Get the file’s mtime.
      fullPath = path.join @staticDir, pubPath
      debug "Looking up mtime for #{pubPath}"
      try
        stats = fs.statSync fullPath
      catch err
        debug "Error looking up mtime for #{pubPath}"
        debug err.toString()
        # Sub in an object with the current time so that it doesn’t try to
        # access the file on every request.
        stats =
          mtime: new Date()
      debug "file mtime: #{stats.mtime}"
      id = stats.mtime.getTime()
      @cachedIDs[pubPath] = id
      return id


  url: (pubPath) ->
    debug "Getting cachebuster ID for #{pubPath}"
    id = @getID(pubPath)
    debug "Fetched cachebuster ID: #{id} for #{pubPath}"
    return "#{pubPath}?v=#{id}"


  pugLinkFilter: (text, options) ->
    # TODO: iterate over all options and include them as tag parameters.
    tag = '<link '
    if options.rel
      tag += ' rel="' + options.rel + '"'
    if options.type
      tag += ' type="' + options.type + '" '
    if options.href
      id = @getID options.href
      tag += ' href="' + options.href + '?v=' + id + '"'
    tag += ' />'
    return tag


export default CacheBuster
