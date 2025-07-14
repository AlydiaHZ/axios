import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "./types";
import parseHeader from "parse-headers";
import AxiosInterceptorManager, {
  interceptor,
} from "./AxiosInterceptorManager";

class Axios {
  // 给 Axios 的实例添加拦截器, 并不是 request 方法
  public interceptors = {
    request: new AxiosInterceptorManager<InternalAxiosRequestConfig>(),
    response: new AxiosInterceptorManager<AxiosResponse>(),
  };
  // axios核心请求方法
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // 发送请求需要对配置进行合并,进行修改等操作
    // 1.对配置进行合并, 默认值

    // 2.拦截器
    const chain: (
      | interceptor<InternalAxiosRequestConfig>
      | interceptor<AxiosResponse>
    )[] = [{ onFulfilled: this.dispatchRequest }]; // 请求的真实逻辑

    this.interceptors.request.interceptors.forEach((interceptor) => {
      interceptor && chain.unshift(interceptor);
    });
    this.interceptors.response.interceptors.forEach((interceptor) => {
      interceptor && chain.push(interceptor);
    });

    let promise: Promise<AxiosRequestConfig | AxiosResponse> =
      Promise.resolve(config); // 构建一个每次执行后返回的 promise
    while (chain.length) {
      const { onFulfilled, onRejected } = chain.shift()!;
      promise = promise.then(
        onFulfilled as (v: AxiosRequestConfig | AxiosResponse) => any,
        onRejected
      );
    }
    // 3.发送请求
    return promise as Promise<AxiosResponse<T>>;
  }

  dispatchRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return new Promise((reslove, reject) => {
      let { url, method, params, headers, data, timeout } = config;
      // 创建一个 ajax 对象
      const request = new XMLHttpRequest();

      // params
      if (params) {
        if (typeof params === "object")
          params = new URLSearchParams(params).toString();
        // /xxx?a=1&name=xxx&age=xxx
        url += url!.includes("?") ? "&" : "?" + params;
      }

      request.open(method!, url!, true);

      // 请求头
      if (headers) {
        for (let key in headers) {
          request.setRequestHeader(key, headers[key]);
        }
      }
      request.responseType = "json";
      request.onreadystatechange = () => {
        // 请求发送成功了, status 为 0 表示请求未发送, 请求(网络)异常
        if (request.readyState === 4 && request.status !== 0) {
          // 请求成功, 而且状态码是 2xx
          if (request.status >= 200 && request.status < 300) {
            let response: AxiosResponse<T> = {
              data: request.response || request.responseText,
              status: request.status,
              statusText: request.statusText,
              headers: parseHeader(request.getAllResponseHeaders()),
              config,
              request,
            };
            reslove(response);
          } else {
            reject(
              "my errorAxiosError: Request failed with status code " +
                request.status
            );
          }
        }
      };
      let requestBody: null | string = null;
      // 请求体
      if (data) {
        requestBody = JSON.stringify(data);
      }
      // 请求的超时时间
      if (timeout) {
        request.timeout = timeout;
        request.ontimeout = function () {
          reject(`my errorAxiosError: timeout of ${timeout}ms exceeded`);
        };
      }
      // 监听错误
      request.onerror = function () {
        reject("net::ERR_INTERNET_DISCONNECTED");
      };

      // 取消请求
      if (config.cancelToken) {
        config.cancelToken.then((message) => {
          request.abort();
          reject(message);
          // 稍后用户会调用 source.cancel() 此promise就成功了
        });
      }
      
      request.send(requestBody);
    });
  }
}

export default Axios;
