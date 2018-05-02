import dummy from './dummy-module'

console.log 'hello from site.coffee'

myfunc = ->
  new Promise (resolve) ->
    console.log 'hello from inside myfunc in site.coffee.'
    resolve()

myfunc2 = ->
  await myfunc()
  console.log 'hello from inside myfunc2 in site.coffee'

myfunc2()

# Next line is an intentional syntax error for testing.
#var b = 2

dummy()
