import debugMod from 'debug'
debug = debugMod 'logger'


formatDate = (date, includeTZ = true) ->
  # Build an NGinX formatted date string.
  months = [
    'Jan'
    'Feb'
    'Mar'
    'Apr'
    'May'
    'Jun'
    'Jul'
    'Aug'
    'Sep'
    'Oct'
    'Nov'
    'Dec'
  ]
  tzHours = Math.trunc(date.getTimezoneOffset() / 60)
  tzMins = date.getTimezoneOffset() - tzHours * 60
  tzOffset = "-#{tzHours.toString().padStart(2,0)}" \
    + "#{tzMins.toString().padStart(2,0)}"
  time = "#{date.getDate()}/#{months[date.getMonth()]}/#{date.getUTCFullYear()}" \
    + ":#{date.getHours().toString().padStart(2,0)}" \
    + ":#{date.getMinutes().toString().padStart(2,0)}" \
    + ":#{date.getSeconds().toString().padStart(2,0)}"
  if includeTZ
    time += " #{tzOffset}"
  return time


logRequest = (ctx, ct) ->
  if ! ct
    ct = new Date()

  ip = ctx.ip.replace /::ffff:/, ''

  time = formatDate ct, true

  # Log an NginX formatted request / response entry
  console.log "#{ip} - - [#{time}] \"#{ctx.method} #{ctx.path} HTTP/1.1\"" \
    + " #{ctx.status} #{ctx.length} " \
    + "\"#{ctx.protocol}://#{ctx.host}#{ctx.url}\"" \
    + " \"#{ctx.header['user-agent']}\""


logError = (ctx, err, ct) ->
  if ! ct
    ct = new Date()

  ip = ctx.ip.replace /::ffff:/, ''

  time = formatDate ct, false

  # Log an NginX formatted error entry to stderr
  entry = "#{time} [error] #{process.pid}#0 \"#{ctx.path}\""
  if err.message
    entry += " #{err.message}"
  entry += ", client: #{ip}, server: #{ctx.hostname}"\
    + ", request: \"#{ctx.method} #{ctx.path} HTTP/1.1\"" \
    + ", host: \"#{ctx.host}\""

  console.error entry


loggerSetup = (options = {}) ->
  if options.logErr == undefined
    logErr = false
  else
    logErr = options.logErr

  if options.logReq == undefined
    logReq = true
  else
    logReq = options.logReq

  return (ctx, next) ->
    ct = new Date()

    try
      await next()
    catch err
      if logReq
        logRequest ctx, ct
      if logErr
        logError ctx, err, ct
      throw err

    if logReq
      logRequest ctx, ct


export default loggerSetup
