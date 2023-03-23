<script lang="ts" setup>
import { ModbusDevice } from "@/utils/serialPort";
import { ref, reactive } from "vue";
let data = ref("10 3 0 96 0 8");
let msgs = reactive<string[]>([]);
let port: ModbusDevice;
async function link() {
  port = new ModbusDevice({
    baudRate: 9600,
    dataBits: 8,
    stopBits: 2,
    parity: "none",
  });
  port.on("send", (data: any) => {
    msgs.unshift("TX:" + data);
  });
  port.on("data", (data: any) => {
    msgs.unshift("RX:" + data);
  });
}
async function send() {
  port.send(data.value.split(" ").map((item) => Number(item)));
}
</script>
<template>
  <div>说明: 在文本域输入数字, 使用空格隔开数字</div>
  <div>
    从机地址, 功能码, 寄存器地址, 寄存器地址, 读取寄存器数量, 读取寄存器数量
  </div>
  <textarea v-model="data"></textarea><br />
  <button @click="link">link</button>
  <button @click="send">send</button>
  <button @click="port.close">close</button>
  <button @click="msgs.length = 0">clear</button>
  <div v-for="item in msgs">{{ item }}</div>
</template>
