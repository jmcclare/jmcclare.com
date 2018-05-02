import app from './core'

if !module.parent
  port = process.env.PORT || 3000
  server = app.listen port, () =>
    console.log "server started at port #{port}"

export default app
