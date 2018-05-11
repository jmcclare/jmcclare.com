# Cache Buster #

A decorator for local file URLs that changes them to ensure browsers fetch the
latest version.


### Usage ###

In whatever file you define your routes in.

```coffee
import CacheBuster from 'cache-buster'
import path from 'path'
import Router from 'koa-router'

# Set the local path to the directory you serve your static files from.
staticDir = path.join __dirname, '../public'
cacheBuster = new CacheBuster staticDir
router = new Router()

# Add cacheBuster.url to your view context. Here is how to add it to the
# context for all views.
topRouter.use (ctx, next) =>
  ctx.state.cburl = cacheBuster.url
  await next()

topRouter.get 'home', '/', (ctx, next) =>
  locals =
    title: 'Home Page'
  ctx.render 'home', locals
```

This makes `cacheBuster.url()` available as `cburl()` in your templates.

When linking to a local file in a template (assuming you are using Pug).

```jade
link(rel='stylesheet' href=cburl('/_css/site.css') type='text/css')
```
