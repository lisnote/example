import { SerialPortDevice, toDecimalArray } from "./";
import { crc16modbus } from "crc";
export class modbusDevice extends SerialPortDevice {
  async send(data: number[]): Promise<void> {
    let crcCode = toDecimalArray(
      crc16modbus(new Uint8Array(data)),
      2
    ).reverse();
    data = data.concat(crcCode);
    const writer = this.port?.writable?.getWriter();
    if (!writer) {
      console.error("获取 writer 失败");
      return;
    }
    const message = new Uint8Array(data);
    this.runEventFun("send", message);
    await writer.write(message);
    writer.releaseLock();
  }
}
