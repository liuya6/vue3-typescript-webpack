import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { Toast } from "vant";

const instance = axios.create({
  timeout: 10000,
});
const CancelTokenSourceMap = new Map();

export const httpCancel = {
  abort(url: string) {
    const source: CancelTokenSource | null = CancelTokenSourceMap.get(url);
    if (source) {
      source.cancel();
      CancelTokenSourceMap.delete(url);
    }
  },
  abortAll() {
    CancelTokenSourceMap.forEach((source: CancelTokenSource) => {
      source.cancel();
    });
    CancelTokenSourceMap.clear();
  },
};

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (config.headers.loading) {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
    }

    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    CancelTokenSourceMap.set(config.url, source);

    // console.log(cancel, "cancel");

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 删除cancel token
    CancelTokenSourceMap.delete(response.config.url);
    // 对响应数据做点什么
    Toast.clear();

    return response;
  },
  function (error) {
    // 对响应错误做点什么
    console.log(error.response);
    if (error.response) {
      if (error.response.status === 504) {
        return Toast.fail("服务器开小差了，请稍后重试...");
      }
      Toast.fail(error.response.data.message);
    }
    // 删除cancel token
    const url = error.config.url;
    console.log(url, "error-url");
    if (url) {
      CancelTokenSourceMap.delete(error.config.url);
    }

    return Promise.reject(error);
  }
);

export function http(config: AxiosRequestConfig) {
  let data = {};
  let params = {};
  switch (config.method) {
    case "get":
      params = config.params || {};
      break;
    case "post":
      data = config.data || {};
      break;
  }
  // console.log(config, "config");
  return instance({
    method: config.method, // 请求方法get,post,put,delete
    url: config.url, // 请求地址
    params: params, // get请求数据
    data: data, // post请求数据
    baseURL: "/", // api的base_url
    headers: {
      // 被发送的自定义请求头
      accept: "application/json",
      ...config.headers,
    },
  }).catch((error) => {
    return error;
  });
}
