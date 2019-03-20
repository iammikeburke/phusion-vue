
/**
 * Dependencies
 */

var path = require('path');
var env = process.env.ENV ? process.env.ENV : 'dev';

/**
 * Config Options
 */
var classmapTaskPath = './exports/build/ClassmapTask';
var templatesTaskPath = './exports/build/TemplatesTask';
var routesTaskPath = './exports/build/RoutesTask';
var outputFileExt = (env === 'prod') ? '.min.js' : '.js';
var sourceMapOutputFileExt = '.map';
var mode = (env === 'prod') ? 'production' : 'development';
var sourcemap = (env === 'prod') ? undefined : 'source-map';

module.exports = [
  /**
   * ClassmapTask
   */
  {
    mode:         mode,
    watch:        false,
    watchOptions: {
      aggregateTimeout: 300
    },
    entry:        {
      ClassmapTask: classmapTaskPath
    },
    devtool:      sourcemap,
    output:       {
      path:              path.resolve(__dirname, "dist/build"),
      filename:          '[name]' + outputFileExt,
      sourceMapFilename: '[name]' + sourceMapOutputFileExt,
      libraryTarget:     'commonjs',
      library:           '[name]'
    },
    resolve:      {
      extensions: ['.js', '.ts']
    },
    target:       "node",
    module:       {
      rules: [
        {
          test:    /\.ts/,
          exclude: /node_modules\/(?!phusion|vue).*/,
          use:     [
            {
              loader:  'ts-loader',
              options: {
                context: __dirname,
              },
            }
          ]
        }
      ]
    }
  },
  /**
   * TemplateCacheTask
   */
  {
    mode:         mode,
    watch:        false,
    watchOptions: {
      aggregateTimeout: 300
    },
    entry:        {
      TemplatesTask: templatesTaskPath
    },
    devtool:      sourcemap,
    output:       {
      path:              path.resolve(__dirname, "dist/build"),
      filename:          '[name]' + outputFileExt,
      sourceMapFilename: '[name]' + sourceMapOutputFileExt,
      libraryTarget:     'commonjs',
      library:           '[name]'
    },
    resolve:      {
      extensions: ['.js', '.ts']
    },
    target:       "node",
    externals:    [],
    module:       {
      rules: [
        {
          test:    /\.ts/,
          exclude: /node_modules\/(?!phusion|vue).*/,
          loaders: 'ts-loader',
          options: { allowTsInNodeModules: true }
        }
      ]
    }
  },
  /**
   * RoutesTask
   */
  {
    mode:         mode,
    watch:        false,
    watchOptions: {
      aggregateTimeout: 300
    },
    entry:        {
      RoutesTask: routesTaskPath
    },
    devtool:      sourcemap,
    output:       {
      path:              path.resolve(__dirname, "dist/build"),
      filename:          '[name]' + outputFileExt,
      sourceMapFilename: '[name]' + sourceMapOutputFileExt,
      libraryTarget:     'commonjs',
      library:           '[name]'
    },
    resolve:      {
      extensions: ['.js', '.ts']
    },
    target:       "node",
    externals:    [],
    module:       {
      rules: [
        {
          test:    /\.ts/,
          exclude: /node_modules\/(?!phusion|vue).*/,
          use:     [
            {
              loader:  'ts-loader',
              options: {
                context: __dirname,
              },
            }
          ]
        }
      ]
    }
  }
]
;

