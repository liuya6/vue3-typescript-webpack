const path = require("path");
const { merge } = require("webpack-merge");
const WebpackCommon = require("./webpack.common");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

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
    // new BundleAnalyzerPlugin(), // 可视化分析打包数据

    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new CompressionPlugin({
      exclude: /\.(html|ico)$/,
    }), //gzip
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin(), //压缩js
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        extractComments: false, // 去除所以注释
        terserOptions: {
          compress: { pure_funcs: ["console.log"] }, // 去除所以console
        },
      }),
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
