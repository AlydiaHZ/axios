type OnFulfilled<V> = (val: V) => V | Promise<V>;
type OnRejected = (err: any) => any;

export interface interceptor<V> {
  onFulfilled?: OnFulfilled<V>;
  onRejected?: OnRejected;
}

// 功能, 同时可以当作类型来使用
class AxiosInterceptorManager<V> {
  public interceptors: Array<interceptor<V> | null> = [];

  use(onFulfilled?: OnFulfilled<V>, onRejected?: OnRejected): number {
    this.interceptors.push({
      onFulfilled,
      onRejected,
    });
    return this.interceptors.length - 1;
  }

  eject(id: number) {
    if (this.interceptors[id]) this.interceptors[id] = null;
  }
}

export default AxiosInterceptorManager;
