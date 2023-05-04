<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
onMounted(() => {
  console.log(chartRef.value);
  const myChart = echarts.init(chartRef.value);

  const data = [
    { value: 1048, name: 1 },
    { value: 735, name: 2 },
    { value: 580, name: 3 },
    { value: 484, name: 4 },
    { value: 300, name: 5 },
  ];
  const totalData = data.reduce((pre, item) => pre + item.value, 0);
  const option: any = {
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        startAngle: 90,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        hoverAnimation: false,
        emphasis: {
          disabled: true,
        },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 4
      },
        data: [
          ...data,
          // 隐形半圆
          {
            value: totalData / 0.5 - totalData,
            itemStyle: {
              color: "none",
              decal: {
                symbol: "none",
              },
            },
            label: {
              show: false,
            },
          },
        ] as never[],
      },
    ],
  };
  myChart.setOption(option);
});
</script>

<template>
  <div class="chart" ref="chartRef"></div>
</template>
<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
