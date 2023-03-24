import SerialEventTarget from "./event";
/**
 * 串口设备类, 主要有以下功能
 * 1. send 发送信息
 * 2. close 关闭串口
 * 3. on 监听事件
 */
export class SerialPortDevice extends SerialEventTarget {
  protected port: SerialPort | undefined;
  protected reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  protected writer: WritableStreamDefaultWriter<Uint8Array> | undefined;
  constructor(serialOptions: SerialOptions) {
    super();
    navigator.serial
      .getPorts()
      .then(async (authorizedDevice) => {
        this.port =
          authorizedDevice.length === 1
            ? authorizedDevice[0]
            : await navigator.serial.requestPort();
        this.port.readable ?? (await this.port.open(serialOptions));
        this.initReader();
      })
      .catch((e) => this.emit("error", e));
  }
  /**
   * 返回一个 Promise, 此 Promise 在串口打开后 resolve.
   * @returns { Promise<void> } 串口打开后 resolve
   */
  public isReady(): Promise<void> {
    return new Promise<void>((resolve, rejects) => {
      const retry = () => {
        if (this.port) {
          resolve();
        } else {
          setTimeout(retry, 100);
        }
      };
      retry();
    });
  }
  /**
   * 发送数据
   * @param { number[] } data 待发送的指令数组
   * @returns { Promise<void> } 发送数据后 resolve
   */
  public async send(data: number[]): Promise<void> {
    this.writer = this.writer ?? this.port?.writable?.getWriter();
    if (!this.writer) {
      this.emit("error", new Event("writer 获取失败"));
      return;
    }
    let message = new Uint8Array(data);
    this.emit("send", message);
    await this.writer.write(message);
  }
  /**
   * 关闭串口
   * @returns { Promise<void> } 关闭串口后 resolve
   */
  public async close(): Promise<void> {
    this.writer?.releaseLock();
    await this.reader?.cancel().finally(() => this.port?.close());
  }
  /**
   * 初始化 Reader
   * @returns { Promise<void> } 初始化 Reader 后 resolve
   */
  protected async initReader(): Promise<void> {
    this.reader = this.port?.readable?.getReader();
    let data: number[] = [];
    let timmer;
    let dataHandle = () => {
      this.emit("data", data);
      data = [];
    };
    while (this.reader) {
      try {
        const { value, done } = await this.reader.read();
        if (done) return;
        data = data.concat(...value);
        timmer ? clearTimeout(timmer) : undefined;
        timmer = setTimeout(dataHandle, 20);
      } catch (e) {
        this.emit("error", e);
        // await 失败, 读取流异常断开, 重新获取.
        if (!this.port?.readable?.locked) {
          this.reader = this.port?.readable?.getReader();
        }
      }
    }
  }
}
