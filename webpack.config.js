// webpack configuration
const dependencies = ['webpack', 'path', 'copy-webpack-plugin', 'html-webpack-plugin', 'webpack-bundle-analyzer'];
const include = deps => deps.map(dep => require(dep));

// utils
const build_proxy = (webpack_config, client_config) => {
  for (let key in client_config) {
    const isHost = key.match('_host');
    if (isHost) {
      if (!webpack_config.devServer.proxy) webpack_config.devServer.proxy = {};
      proxy = key.replace('_host', '');
      webpack_config.devServer.proxy[`/${proxy}`] = {
        target: client_config[key],
        pathRewrite: {[`^/${proxy}`]: ''} // remove prefix from host endpoint
      };
      console.log('PROXY:', proxy, '\nTARGET:', client_config[key])
    }
  }
}
const activate_hmr = (webpack, config) => {
  config.entry['hot-module'] = 'react-hot-loader/patch';
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devServer['hot'] = true;
}


// webpack config
module.exports = env => ((function(webpack, path, CopyPlugin, HtmlPlugin, Analyzer) {

  const resolve = directory => path.resolve(__dirname, directory)
  const config = {

    mode: "development",

    entry: resolve('src/bootstrap.js'),

    output: {
      path: resolve('dist/'),
      publicPath: '/',
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js'
    },

    resolve: {
      alias: {
        client_config: resolve('config/app.json'),
        styles: resolve('config/styles.json'),
        components: resolve('src/components/'),
        services: resolve('src/services/'),
        assets: resolve('src/assets/')
      },
      extensions: ['*', '.js', '.jsx', ".ts", ".tsx"],
    },

    module: {

      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        },
        {
          test: '/\.(html)$/',
          use: ['raw']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|eot|gltf|bin|glb|stl)$/,
          use: ['file-loader']
        }
      ]
    },

    plugins: [
      new webpack.ProvidePlugin({
        CLIENT_CONFIG: 'client_config',
        STYLES: 'styles'
      }),
      new CopyPlugin([{ from: 'src/favicon.png', to: 'dist/'}]), // copy top-level independent favicon to served src//
      new HtmlPlugin({ template: resolve('src/index.html'), inject: 'body' }),
      new Analyzer.BundleAnalyzerPlugin({ analyzerPort: 9123 }) // bundle chunks visualizer
    ],

  };

  config.devtool = 'inline-source-map';

  config.devServer = {
    contentBase: resolve('dist/'),
    compress: true,
    allowedHosts: ['localhost'],
    port: 3245,
    historyApiFallback: true,
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  };

  const client_config = require('./config/app.json');
  if (client_config) build_proxy(config, client_config);
  if (env && env.hot) activate_hmr(webpack, config);

  console.log('WEBPACK CONFIG', config)

  return config;
})(...include(dependencies)));