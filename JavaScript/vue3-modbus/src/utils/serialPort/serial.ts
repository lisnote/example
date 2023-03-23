import SerialEventTarget from "./event";
/**
 * 串口设备类, 主要有以下功能
 * 1. send 发送信息
 * 2. close 关闭串口
 * 3. on 监听事件
 */
export class SerialPortDevice extends SerialEventTarget {
  private port: SerialPort | undefined;
  private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  private writer: WritableStreamDefaultWriter<Uint8Array> | undefined;
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
      .catch(console.error);
  }
  /**
   * 返回一个 Promise, 此 Promise 在串口打开时 resolve.
   * @returns {Promise<void>}
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
   * @param { number[] } data
   * @returns { Promise<void> }
   */
  public async send(data: number[]): Promise<void> {
    this.writer = this.writer ?? this.port?.writable?.getWriter();
    if (!this.writer) {
      console.error("获取 writer 失败");
      return;
    }
    let message = new Uint8Array(data);
    this.emit("send", message);
    await this.writer.write(message);
  }
  /**
   * 关闭串口
   * @returns { Promise<void> }
   */
  public async close(): Promise<void> {
    console.log({ ...this.port }, this.port);
    this.reader?.cancel().then(() => {
      this.writer?.releaseLock();
      this.port?.close();
    });
  }
  /**
   * 初始化 Reader
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
        console.error(e);
        // await 失败, 读取流异常断开, 重新获取.
        if (!this.port?.readable?.locked) {
          this.reader = this.port?.readable?.getReader();
        }
      }
    }
  }
}
