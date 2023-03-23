/**
 * 将十进制数字转换为寄存器中的二进制格式
 * @param value 待转换的值
 * @param arrayLength byte 长度
 * @returns {string[]} 二进制**字符串**数组
 */
export function toByteArray(value: number, arrayLength: number): string[] {
  let binary = value.toString(2);
  binary = new Array(arrayLength * 8 - binary.length).fill(0).join("") + binary;
  let byteArray: string[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    byteArray.push(binary.substring(i, i + 8));
  }
  return byteArray;
}

/**
 * 将十进制数字转换为寄存器中的二进制格式, 再将每个8位转换为一个十进制数字
 * @param value 待转换的值
 * @param arrayLength byte 长度
 * @returns {number[]} 十进制数组
 */
export function toDecimalArray(value: number, arrayLength: number): number[] {
  return toByteArray(value, arrayLength).map((item) => parseInt(item, 2));
}
