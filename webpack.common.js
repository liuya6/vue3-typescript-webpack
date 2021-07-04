const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
  entry: path.resolve(__dirname, "./src/main.ts"),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "happypack/loader?id=happyBabel",
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "happypack/loader?id=happyBabel",
          },
          {
            loader: "ts-loader",
            options: { appendTsSuffixTo: [/\.vue$/] },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
    }),

    new VueLoaderPlugin(),

    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: "happyBabel",
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: "babel-loader?cacheDirectory=true",
        },
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    }),
  ],

  resolve: {
    extensions: [".vue", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
