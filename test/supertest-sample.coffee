import request from 'supertest'
import assert from 'assert'

#import app from '../'
# Import the app directly from `core` instead. The main index will
# start its own server. This will cause two instances of webpack to run and they
# will interfere with each other.
import app from '../core'

# Declare an empty server object in this scope so the before and after methods
# below can both access it for starting and stopping.
server = {}

describe 'home page', ->
  before ->
    server = app.listen()
  after ->
    server.close()

  it 'responds with text', (done) ->
    request(server)
      .get('/')
      .expect('Content-Type', /text/)
      .expect 200, (err, res) ->
        if err
          return done err
        res.should.be.html
        assert res.text.indexOf('<title>Jonathan MᶜClare') != -1
        done()
    # Add a blank return so that CoffeeScript doesn’t put one in front of the
    # request call. That confuses Mocha. If you put a `return` in front of the
    # call to `request` Mocha assumes you are giving it a promise.
    return

  # Now with a promise. I put the return in explicitly to demonstrate what’s
  # going on. CoffeeScript would have put it in anyway though.
  it 'responds with text again', ->
    return request(server)
      .get('/')
      .expect(200)
      .then (res) =>
        assert res.text.indexOf('<title>Jonathan MᶜClare') != -1
