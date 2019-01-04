const path = require('path');

const {
  ProgressPlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

require('dotenv').config();

module.exports = (env = {}) => ({
  entry: './src/app/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[hash].js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'tslint-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new ProgressPlugin(),
    new NoEmitOnErrorsPlugin(),
    new DotenvPlugin({
      systemvars: true,
      silent: true,
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/index.html.hbs',
      cache: true,
    }),
    new HotModuleReplacementPlugin(),
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, 'src/images/**/*'),
    //   to: path.resolve(__dirname, 'dist'),
    // },{
    //   from: path.resolve(__dirname, 'src/css/extends/rui.css'),
    //   to: path.resolve(__dirname, 'dist/css/extends/rui.css'),
    // }]),
  ],
  devtool: 'inline-source-map',
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: process.env.WDS_PORT,
    public: process.env.SELECT_URL,
  },
});
