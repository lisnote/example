export type Event = "receive" | "send";
export class SerialPortDevice {
  // -------------------------------------------------- 初始化
  async link(options: SerialOptions): Promise<void> {
    await this.initPort(options);
    this.initReader();
  }
  // 连接设备 & 初始化 port
  protected port: SerialPort | undefined;
  protected async initPort(options: SerialOptions): Promise<void> {
    let authorizedDevice = await navigator.serial.getPorts();
    this.port =
      authorizedDevice.length === 1
        ? authorizedDevice[0]
        : await navigator.serial.requestPort();
    this.port.readable ?? (await this.port.open(options));
  }
  // 监听输入
  protected async initReader(): Promise<void> {
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    if (!this.port?.readable?.locked) {
      while (true) {
        reader = this.port?.readable?.getReader();
        try {
          while (reader) {
            const { value } = await reader.read();
            this.runEventFun("receive", value);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  // -------------------------------------------------- 事件绑定
  protected eventFn: { [key: string]: Function[] } = {};
  public on(event: Event, callback: (...data: any[]) => void) {
    this.eventFn[event] = this.eventFn[event] ?? [];
    this.eventFn[event].push(callback);
  }
  protected runEventFun(event: Event, ...data: any[]) {
    this.eventFn[event].forEach((fn) => fn(...data));
  }

  // -------------------------------------------------- 发送信息
  public async send(data: number[]): Promise<void> {
    const writer = this.port?.writable?.getWriter();
    if (!writer) {
      console.error("获取 writer 失败");
      return;
    }
    let message=new Uint8Array(data)
    this.runEventFun("send", message);
    await writer.write(message);
    writer.releaseLock();
  }
}
