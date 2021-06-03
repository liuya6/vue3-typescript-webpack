import axios, { AxiosRequestConfig } from "axios";

const CancelToken = axios.CancelToken;
let cancel = new Map();

const instance = axios.create({
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancel.get(c);
    });

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
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
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
    },
  }).catch((error) => {
    return error.message;
  });
}
