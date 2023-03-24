import { SerialPortDevice } from ".";
import { checkoutCrc, crc16OrderGenerator } from "./crc16";

export class ModbusDevice extends SerialPortDevice {
  /**
   * 发送数据
   * @param { number[] } data
   * @returns { Promise<void> } 发送结束后 resolve
   */
  public async send(data: number[]): Promise<void> {
    await super.send(crc16OrderGenerator(data));
  }

  /**
   * 初始化 Reader
   * @returns { Promise<void> } 初始化结束后 resolve
   */
  protected async initReader(): Promise<void> {
    this.reader = this.port?.readable?.getReader();
    let data: number[] = [];
    let timmer;
    let dataHandle = () => {
      if (checkoutCrc(data)) this.emit("data", data);
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
