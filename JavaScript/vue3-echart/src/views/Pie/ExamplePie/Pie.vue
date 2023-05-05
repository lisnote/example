<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
onMounted(() => {
  const myChart = echarts.init(chartRef.value);

  const data = Array.from({ length: 14 }).map((_v, i) => ({
    name: i,
    value: 1,
  }));
  const totalData = data.reduce((pre, item) => pre + item.value, 0);
  const option: any = {
    series: [
      {
        name: "外边框",
        type: "pie",
        radius: ["40%", "70%"], //边框大小
        itemStyle: {
          borderColor: "gray",
          borderWidth: 8,
        },
        animationEasing: "linear",
        animationDuration: 500,
        data: [
          {
            value: 10,
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
        ],
      },
      {
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
          scale: false,
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 4,
        },
        animationEasing: "linear",
        animationDuration: 250,
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
  <div class="main">
    <div class="chart" ref="chartRef"></div>
  </div>
</template>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;

  .chart {
    width: 100%;
    height: 100%;
    background-color: #0000;
  }
}
</style>
