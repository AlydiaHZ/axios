export function isCancel(message: any): message is Cancel {
  return message instanceof Cancel;
}

export class Cancel {
  constructor(public message: string) {}
}
export class CancelTokenStatic {
  public reslove: any;
  
  source() {
    return {
      // 一个 promise 方法
      token: new Promise<Cancel>((reslove, reject) => {
        this.reslove = reslove;
      }),
      // 让 promise 成功
      cancel: (message: string) => {
        this.reslove(new Cancel(message));
      },
    };
  }
}
