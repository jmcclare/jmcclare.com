import webpack from 'webpack'
import path from 'path'
import babelMinify from 'babel-minify-webpack-plugin'


appRoot = path.resolve path.join __dirname, '../'

developmentPlugins = [
  new webpack.NoEmitOnErrorsPlugin()
  new webpack.HotModuleReplacementPlugin()
]

productionPlugins = [
  # This is taken from the default production plugins so it unnecessary here.
  #new webpack.DefinePlugin({
    #'process.env.NODE_ENV': JSON.stringify('production')
  #})

  # These two plugins cause an error when compiling through webpack-stream.
  #new webpack.optimize.UglifyJsPlugin()
  #new webpack.optimize.DedupePlugin(),

  # This plugin seems to be unnecessary. It seems like the default production
  # plugins already do their own minification.
  #new babelMinify()
]



webpackConfig = (mode) ->

  if mode == 'development' || mode == 'test'
    mode = 'development'
    plugins = developmentPlugins
  else
    mode = 'production'
    plugins = productionPlugins

  config =
    entry:
      '_js/react-app.js': [path.join(appRoot, 'assets', '_js', 'react-app.jsx')]
      '_js/site.js': [path.join(appRoot, 'assets', '_js', 'site.coffee')]
    #context: path.join(appRoot, 'assets')
    output:
      path: path.join(appRoot, 'public')
      publicPath: '/'
      filename: '[name]'
    resolve:
      extensions: ['.js', '.jsx', '.coffee']
    plugins: plugins
    module:
      rules:
        [
          {
            test: /\.jsx?$/
            loader: 'babel-loader'
            query:
              presets: ['es2015', 'react']
              plugins: ['transform-regenerator', 'transform-async-to-generator', 'transform-class-properties']
            # You can omit the `include` parameter altogether, but that may
            # cause it to traverse everything under the app directory.
            # Including the whole `site_modules` directory covers a lot, but
            # it’s easier than including each module’s `assets/_js` dir and it
            # hasn’t caused any problems.
            include: [
              path.resolve(appRoot, 'assets', '_js'),
              path.resolve(appRoot, 'site_modules'),
              path.resolve(appRoot, 'src')
            ]
          }, {
            test: /\.coffee?$/,
            loader: 'coffee-loader',
            options:
              transpile:
                presets: ['es2015']
            include: [path.resolve(appRoot, 'assets', '_js'), path.resolve(appRoot, 'site_modules')]
          }
        ]
    mode: mode

  return config

export default webpackConfig
