import Axios from "./Axios";
import { CancelTokenStatic, isCancel } from "./CancelToken";
import { AxiosInstance } from "./types";

function createInstance() {
  // 1.创建类的实例
  const context = new Axios();

  // 2.获取 request 方法, 并且让 request 中的 this 永远执行类的实例
  let instance = Axios.prototype.request.bind(context);
  instance = Object.assign(instance, context);

  // 3.返回 request 的方法
  return instance as AxiosInstance;
}

const axios = createInstance();
axios.CancelToken = new CancelTokenStatic();
axios.isCancel = isCancel;

export default axios;
export * from "./types";
