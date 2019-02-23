
/**
 * Dependencies
 */

var path = require('path');
var env = process.env.ENV ? process.env.ENV : 'dev';

/**
 * Config Options
 */
var classmapTaskPath = './exports/build/ClassmapTask';
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
  }
]
;

