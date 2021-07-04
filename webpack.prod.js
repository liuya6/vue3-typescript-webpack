const path = require("path");
const { merge } = require("webpack-merge");
const WebpackCommon = require("./webpack.common");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

module.exports = merge(WebpackCommon, {
  mode: "production",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    assetModuleFilename: "",
  },

  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader",
          {
            loader: "style-resources-loader",
            options: {
              patterns: path.resolve(__dirname, "src/style/theme/index.less"), //配置全局less
              injector: "append",
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 5 * 1024,
            name: "assets/[name].[contenthash:8].[ext][query]",
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new BundleAnalyzerPlugin(), // 可视化分析打包数据
    new CompressionPlugin({
      exclude: /\.html$/,
    }), //gzip

    new ParallelUglifyPlugin({
      uglifyJS: {
        /*
           是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
           可以设置为false
          */
        // beautify: false,
        /*
         是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
        */
        // comments: false,
      },
      compress: {
        /*
          是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
          不大的警告
         */
        warnings: false,
        /*
         是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
        */
        drop_console: true,
        /*
         是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
         转换，为了达到更好的压缩效果，可以设置为false
        */
        collapse_vars: true,
        /*
         是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
         var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
        */
        reduce_vars: true,
      },
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin(), //压缩js
      new CssMinimizerPlugin(), // 压缩css
    ],
    splitChunks: {
      chunks: "all",

      cacheGroups: {
        vendor: {
          name: "vendor", // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 5 * 1024, // 大小限制
          minChunks: 1, // 最少复用过几次
        },

        common: {
          name: "common",
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 2, // 公共模块最少复用过几次
        },
      },
    },
  },
});
