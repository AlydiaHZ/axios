import axios, { AxiosRequestConfig, AxiosResponse } from "./axios";

// 基础路径 访问的后台路径
const baseURL = "http://localhost:8080";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 发送 get 请求和 post 请求
interface Person {
  name: string;
  age: number;
}

let person: Person = { name: "zs", age: 18 };
// let requestConfig: AxiosRequestConfig = {
//   url: baseURL + "/get",
//   method: "get",
//   params: person,
// };

// let requestConfig: AxiosRequestConfig = {
//   url: baseURL + "/post",
//   method: "post",
//   data: person,
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// let requestConfig: AxiosRequestConfig = {
//   url: baseURL + "/post_status?code=404",
//   method: "post",
//   data: person,
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// let requestConfig: AxiosRequestConfig = {
//   url: baseURL + "/post_timeout?timeout=3000",
//   method: "post",
//   data: person,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 1000,
// };
let requestConfig: AxiosRequestConfig = {
  url: baseURL + "/post",
  method: "post",
  data: person,
  cancelToken: source.token,
};

// 拦截器
// axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   config.headers.name += "a";
//   return config;
// });
// axios.interceptors.request.use((config) => {
//   config.headers.name += "b";
//   return config;
// });

// 希望的返回值也是 person
axios(requestConfig)
  .then((response: AxiosResponse<Person>) => {
    console.log(response.data.name);
    return response.data;
  })
  .catch((error: any) => {
    if (axios.isCancel(error)) return console.log("取消");
    console.log(error);
  });

source.cancel("cancel");

/**
 * 失败有几种情况?
 * 1.网络 -- status 1:未发送; 2:已打开; 3:载入中; 4:完成;
 * 2.状态码 4xx
 * 3.超时处理
 */
