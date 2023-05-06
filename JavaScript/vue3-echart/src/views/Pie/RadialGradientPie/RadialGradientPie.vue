<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
onMounted(() => {
  const myChart = echarts.init(chartRef.value);
  const option: any = {
    series: [
      {
        type: "pie",
        labelLine: {
          show: false,
        },
        itemStyle: {
          color: {
            global: true,
            type: "radial",
            x: myChart.getWidth() / 2,
            y: myChart.getHeight() / 2,
            r: 0.7 * myChart.getWidth(),
            colorStops: [
              { offset: 0, color: "#0000" },
              { offset: 1, color: "#b298eb" },
            ],
          },
        },
        data: [1],
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
