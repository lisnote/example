<script lang="ts" setup>
import { modbusDevice } from "@/utils/serialPort";
const device = new modbusDevice();

device.on("receive", (value) => {
  console.log("收到", new Array(...value));
});
device.on("send", (value) => {
  console.log("发送", new Array(...value));
});
async function link() {
  await device.link({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
  });
  // device.send([1, 3, 0, 96, 0, 4]);
  device.send([3, 3, 0, 96, 0, 4]);
}
// 功能函数
</script>
<template>
  <button @click="link">link</button>
</template>
