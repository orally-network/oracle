const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve('.dfx', 'local', 'canister_ids.json'));
  } catch (error) {
    console.log('No local canister_ids.json found. Continuing production');
  }
  try {
    prodCanisters = require(path.resolve('canister_ids.json'));
  } catch (error) {
    console.log('No production canister_ids.json found. Continuing with local');
  }

  const network =
    process.env.DFX_NETWORK || (process.env.NODE_ENV === 'production' ? 'ic' : 'local');

  const canisterConfig = network === 'local' ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[canisterName.toUpperCase() + '_CANISTER_ID'] = canisterDetails[network];
    return prev;
  }, {});
}
const canisterEnvVariables = initCanisterEnv();

const frontendDirectory = 'app_frontend';

const asset_entry = path.join('src', frontendDirectory, 'src', 'index.html');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    target: 'web',
    mode: argv.mode,
    entry: {
      // The frontend.entrypoint points to the HTML file for this build, so we need
      // to replace the extension to `.js`.
      index: path.join(__dirname, asset_entry).replace(/\.html$/, '.jsx'),
    },
    devtool: isDevelopment ? 'source-map' : false,
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin()],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallback: {
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
        stream: require.resolve('stream-browserify/'),
        util: require.resolve('util/'),
      },
      alias: {
        Components: path.resolve(__dirname, './src/app_frontend/src/components/'),
        Services: path.resolve(__dirname, './src/app_frontend/src/services/'),
        Constants: path.resolve(__dirname, './src/app_frontend/src/constants/'),
        Interfaces: path.resolve(__dirname, './src/app_frontend/src/interfaces/'),
        ApiHooks: path.resolve(__dirname, './src/app_frontend/src/apiHooks/'),
        Utils: path.resolve(__dirname, './src/app_frontend/src/utils/'),
        Styles: path.resolve(__dirname, './src/app_frontend/src/styles/'),
        Assets: path.resolve(__dirname, './src/app_frontend/assets/'),
        Declarations: path.resolve(__dirname, './src/declarations/'),
        Shared: path.resolve(__dirname, './src/app_frontend/src/shared/'),
        Pages: path.resolve(__dirname, './src/app_frontend/src/pages/'),
        OD: path.resolve(__dirname, './src/app_frontend/src/outerDeclarations/'),
        Providers: path.resolve(__dirname, './src/app_frontend/src/providers/'),
        Canisters: path.resolve(__dirname, './src/app_frontend/src/canisters/'),
        ABIs: path.resolve(__dirname, './src/app_frontend/src/ABIs/'),
        Stores: path.resolve(__dirname, './src/app_frontend/src/stores/'),
      },
    },
    output: {
      filename: 'index.js',
      path: path.join(__dirname, 'dist', frontendDirectory),
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { transpileOnly: true },
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: 'compressed',
                },
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    // TODO: Temp to remove perfomance warning. Validate and optimise later.
    performance: {
      hints: false,
      maxEntrypointSize: 10000,
      maxAssetSize: 250000,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, asset_entry),
        cache: false,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src', frontendDirectory, 'assets'),
            to: path.join(__dirname, 'dist', frontendDirectory),
          },
        ],
      }),
      new webpack.DefinePlugin({
        ...canisterEnvVariables,
        'process.env.MODE': JSON.stringify(env.NODE_ENV),
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer'],
        process: require.resolve('process/browser'),
      }),
      new Dotenv(),
    ],
    // proxy /api to port 8000 during development
    devServer: {
      proxy: {
        '/api': {
          target: 'https://icp0.io',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api',
          },
        },
      },
      hot: true,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, 'src', frontendDirectory)],
      liveReload: true,
    },
  };
};
