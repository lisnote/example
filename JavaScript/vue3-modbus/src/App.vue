<script lang="ts" setup>
import { ModbusDevice } from "@/utils/serialPort";

let data = [10, 3, 0, 96, 0, 8];
let port: ModbusDevice;
async function link() {
  port = new ModbusDevice({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
  });
  port.isReady().then(() => {
    port.on("send", (data: any) => {
      console.log("发送", [...data]);
    });
    port.on("data", (data: any) => {
      console.log("收到", [...data], Date.now());
    });
  });
}
async function send() {
  port.send(data);
}
async function close() {
  port.close();
}
function log() {
  console.log(port);
}
</script>
<template>
  <button @click="link">link</button>
  <button @click="send">send</button>
  <button @click="close">close</button>
  <button @click="log">log</button>
</template>
