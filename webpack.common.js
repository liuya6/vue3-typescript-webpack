const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: path.resolve(__dirname, "./src/main.ts"),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
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
  ],

  resolve: {
    extensions: [".vue", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
