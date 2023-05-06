<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
let myChart;
function renderChart() {
  const data = Array.from({ length: 3 }).map((_v, i) => ({
    name: i,
    value: ~~(Math.random() * 100),
  }));
  const option: any = {
    series: [
      {
        type: "pie",
        data,
      },
    ],
  };
  myChart.setOption(option);
}

let resizeObserver: ResizeObserver;
onMounted(() => {
  myChart = echarts.init(chartRef.value);
  renderChart();
  resizeObserver = new ResizeObserver(myChart.resize);
  resizeObserver.observe(document.body);
});
onUnmounted(() => resizeObserver.disconnect());
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
  overflow: hidden;

  .chart {
    width: 100%;
    height: 100%;
    background-color: #0000;
  }
}
</style>
