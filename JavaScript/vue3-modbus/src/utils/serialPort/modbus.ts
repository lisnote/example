import { SerialPortDevice, toDecimalArray } from ".";
import { crc16modbus } from "crc";

export class ModbusDevice extends SerialPortDevice {
  /**
   * 发送数据
   * @param { number[] } data
   * @returns { Promise<void> }
   */
  public async send(data: number[]): Promise<void> {
    data = data.concat(
      toDecimalArray(crc16modbus(new Uint8Array(data)), 2).reverse()
    );
    super.send(data);
  }
  /**
   * 初始化 Reader
   */
  protected async initReader(): Promise<void> {
    this.reader = this.port?.readable?.getReader();
    let data: number[] = [];
    let timmer;
    let dataHandle = () => {
      const sourceOrder = data.slice(0, -2);
      const sourceCrcData = data.slice(-2);
      const crcData = toDecimalArray(
        crc16modbus(new Uint8Array(sourceOrder)),
        2
      ).reverse();
      if (sourceCrcData[0] === crcData[0] && sourceCrcData[1] === crcData[1]) {
        this.emit("data", data);
      }
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
