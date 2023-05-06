<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
onMounted(() => {
  const myChart = echarts.init(chartRef.value);
  const data = Array.from({ length: 3 }).map((_v, i) => ({
    name: i,
    value: ~~(Math.random() * 100),
  }));
  const option: any = {
    series: [
      {
        type: "pie",
        radius: "75%", //边框大小
        itemStyle: {
          color: "none",
          borderColor: "gray",
          borderWidth: 10,
        },
        emphasis: {
          disabled: true,
          scale: false,
        },
        data: [1],
      },
      {
        type: "pie",
        data,
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
