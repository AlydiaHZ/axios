type OnFufilled<V> = (val: V) => V | Promise<V>;
type OnRejected = (err: any) => any;

export interface interceptor<V> {
  onFufilled?: OnFufilled<V>;
  onRejected?: OnRejected;
}

// 功能, 同时可以当作类型来使用
class AxiosInterceptorManager<V> {
  public interceptors: Array<interceptor<V> | null> = [];

  use(onFufilled?: OnFufilled<V>, onRejected?: OnRejected): number {
    this.interceptors.push({
      onFufilled,
      onRejected,
    });
    return this.interceptors.length - 1;
  }

  eject(id: number) {
    if (this.interceptors[id]) this.interceptors[id] = null;
  }
}

export default AxiosInterceptorManager;
