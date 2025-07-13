import AxiosInterceptorManager from "./AxiosInterceptorManager";

export type Methods =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH"
  | "purge"
  | "PURGE"
  | "link"
  | "LINK"
  | "unlink"
  | "UNLINK";

// 请求配置
export interface AxiosRequestConfig {
  url?: string;
  method?: Methods | string;
  params?: any;
  data?: Record<string, any>;
  headers?: Record<string, any>;
  timeout?: number;
}
export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: Record<string, any>;
}
// 响应的类型
export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  config: AxiosRequestConfig;
  request?: XMLHttpRequest;
}

// 对应用户的 axios 的类型 == request 方法
export interface AxiosInstance {
  <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  // 拦截器
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}
