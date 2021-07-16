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

let plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash:8].css",
  }),
  new CompressionPlugin({
    exclude: /\.(html|ico)$/,
  }), //gzip
  new ParallelUglifyPlugin({
    // 压缩js配置
    uglifyJS: {
      output: {
        beautify: false, // 不需要格式化，以最紧凑的方式输出
        comments: false, // 删除注释
      },
      warnings: false, // 删除未使用一些代码时引起的警告
      compress: {
        drop_console: true, // 删除所有console.log
        // 是否内嵌虽定义，但只使用了一次的变量
        // 比如var x = 2, y = 10, z = x + y 变成 z = 12
        collapse_vars: true,
        // 提出多次出现但没定义的变量，将其变成静态值；
        // 比如x = 'xx', y = 'xx' 变成 var a = 'xx', x = a, y = a
        reduce_vars: true,
      },
    },
  }),
];

const analyzer = process.env.npm_lifecycle_event === "analyzer";
// 运行 yarn analyzer 可查看打包分析仪
if (analyzer) {
  // 可视化分析打包数据
  plugins.push(new BundleAnalyzerPlugin());
}

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

  plugins,

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
