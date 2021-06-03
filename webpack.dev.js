const { merge } = require("webpack-merge");
const WebpackCommon = require("./webpack.common");
const path = require("path");

module.exports = merge(WebpackCommon, {
  mode: "development",

  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader",
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
    ],
  },

  devtool: "source-map",

  devServer: {
    host: "0.0.0.0",
    port: "8000",
    hot: true,
    open: true,
    compress: true, // 启动gzip压缩
    historyApiFallback: true, //vue-router mode:history

    proxy: {
      "/api": {
        target: "https://lyq-music.vercel.app",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
