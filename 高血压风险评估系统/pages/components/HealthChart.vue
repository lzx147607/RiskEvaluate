<template>
  <view class="chart-container">
    <canvas 
      canvas-id="chartCanvas"
      id="chartCanvas"
      type="2d"
      class="chart-canvas"
      :style="{width: '100%', height: '300px'}"
    ></canvas>
  </view>
</template>

<script>
import * as echarts from 'echarts';
import { nextTick } from 'vue';

export default {
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  methods: {
    async initChart() {
      try {
        await nextTick(); // 确保DOM更新完成

        const query = uni.createSelectorQuery().in(this);
        query.select('#chartCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            if (!res[0]?.node) {
              throw new Error('Canvas节点未找到');
            }

            // 销毁旧实例
            if (this.chartInstance) {
              this.chartInstance.dispose();
            }

            // 初始化图表
            const canvas = res[0].node;
            this.chartInstance = echarts.init(canvas, null, {
              devicePixelRatio: uni.getSystemInfoSync().pixelRatio
            });

            const options = {
              title: { text: '健康指标' },
              tooltip: {},
              legend: { data: ['您的值'] },
              xAxis: { data: this.chartData.labels },
              yAxis: {},
              series: [{
                name: '您的值',
                type: 'bar',
                data: this.chartData.values
              }]
            };

            this.chartInstance.setOption(options);
          });
      } catch (error) {
        console.error('图表初始化失败:', error);
        uni.showToast({ title: '图表加载失败', icon: 'none' });
      }
    }
  },
  mounted() {
	  console.log(document.getElementById('chartCanvas'));
    this.initChart();
  },
  beforeUnmount() {
    this.chartInstance?.dispose();
  }
};
</script>