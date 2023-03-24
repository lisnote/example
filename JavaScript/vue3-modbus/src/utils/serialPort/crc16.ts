import { toDecimalArray } from "./number";

/**
 * crc16算法
 * @param { numebr[] } order 待计算的指令数组
 * @returns { number } crc16算法值
 */
export function crc16(order: number[]): number {
  const crctab16 = new Uint16Array([
    0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401, 0xa001,
    0x6c00, 0x7800, 0xb401, 0x5000, 0x9c01, 0x8801, 0x4400,
  ]);
  var res = 0xffff;
  for (let b of order) {
    res = crctab16[(b ^ res) & 15] ^ (res >> 4);
    res = crctab16[((b >> 4) ^ res) & 15] ^ (res >> 4);
  }
  return res & 0xffff;
}

/**
 * 通过无 crc 校验位的指令数组, 生成带 crc 校验位的指令数组
 * @param { number[] } order 待转换的指令数组
 * @returns { number[] } 带 crc 校验位的指令数组
 */
export function crc16OrderGenerator(order: number[]): number[] {
  return order.concat(toDecimalArray(crc16(order), 2).reverse());
}

/**
 * 对指令数组进行crc16校验
 * @param { number[] } order 待检测的指令数组
 * @returns { boolean } 校验结果
 */
export function crc16Checkout(order: number[]): boolean {
  const sourceOrder = order.slice(0, -2);
  const sourceCrcData = order.slice(-2);
  const crcData = toDecimalArray(crc16(sourceOrder), 2).reverse();
  return sourceCrcData[0] === crcData[0] && sourceCrcData[1] === crcData[1];
}
