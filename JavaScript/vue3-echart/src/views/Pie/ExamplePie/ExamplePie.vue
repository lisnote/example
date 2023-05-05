<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const chartRef = ref();
onMounted(() => {
  const myChart = echarts.init(chartRef.value);

  const blank = {
    name: "blank",
    value: 0.05,
    itemStyle: {
      color: "none",
    },
  };
  const percent = 0.75;
  const data = Array.from({ length: 14 })
    .map((_v, i) => {
      console.log();
      return {
        name: i,
        value: 1,
        itemStyle: {
          color:
            percent >= (i + 1) / 14 ? `hsl(${213 + i * 5}, 72%, 72%)` : "none",
        },
      };
    })
    // 填充间隔
    .reduce((pre, item) => {
      return pre.concat(blank, item, blank);
    }, [] as any[]);
  const option: any = {
    series: [
      {
        name: "外边框",
        type: "pie",
        radius: ["70%", "77%"], //边框大小
        itemStyle: {
          borderColor: "#b298eb",
          borderWidth: 1,
        },
        emphasis: {
          disabled: true,
          scale: false,
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
          },
        ],
      },
      {
        type: "pie",
        radius: ["55%", "70%"],
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
        animationEasing: "linear",
        animationDuration: 500,
        data: data,
      },
    ],
  };
  myChart.setOption(option);
});
</script>

<template>
  <div class="main">
    <div class="chart" ref="chartRef"></div>
    <div class="content">
      <div class="property">PM2.5</div>
      <div class="value">18</div>
      <div class="unit">ug/m³</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .chart {
    width: 100%;
    height: 100%;
    background-color: #07172a;
  }
  .content {
    color: #82b2eb;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .property {
      color: white;
      font-size: 70px;
    }
    .value {
      font-size: 150px;
    }
    .unit {
      font-size: 70px;
    }
  }
}
</style>
