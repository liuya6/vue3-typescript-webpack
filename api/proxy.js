// 该服务为 vercel serve跨域处理
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
  let target = "";

  // 代理目标地址
  if (req.url.startsWith("/api")) {
    target = "https://lyq-music.vercel.app";
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 `/api`
      // 例如 api/user/login 将被转发到 http://backend-api.com/user/login
      "^/api/": "/",
    },
  })(req, res);
};
