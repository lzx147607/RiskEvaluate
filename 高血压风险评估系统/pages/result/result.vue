<template>
  <view class="result-container">
    <!-- 头部区域 -->
    <view class="result-header">
      <text class="result-title">风险评估报告</text>
      <view class="risk-indicator" :class="resultClass">
        <uni-icons 
          :type="riskLevel==='High' ? 'warning' : 'smile'" 
          size="40" 
          :color="riskLevel==='High' ? '#ff4444' : '#1aad19'" 
        />
        <text class="risk-label">
          {{ riskLevel==='High' ? '高风险' : '低风险' }}
        </text>
      </view>
    </view>

    <!-- 数据可视化 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">健康指标对比</text>
        <view class="chart-legend">
          <view class="legend-item">
            <view class="legend-normal"></view>
            <text>正常范围</text>
          </view>
          <view class="legend-item">
            <view class="legend-abnormal"></view>
            <text>异常指标</text>
          </view>
        </view>
      </view>
      <canvas 
        canvas-id="chartCanvas"
        type="2d"
        :width="chartWidth"
        :height="chartHeight"
        :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }"
        class="chart-canvas"
      />
    </view>

    <!-- 健康建议 -->
    <view class="advice-card">
      <view class="card-header">
        <uni-icons type="info" size="18" color="#2c3e50" />
        <text class="card-title">专业建议</text>
      </view>
      <view class="advice-content">
        <text 
          v-for="(item, index) in adviceList" 
          :key="index" 
          class="advice-item"
        >
          {{ index + 1 }}. {{ item }}
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button 
        class="action-btn history-btn"
        @click="goToHistory"
        hover-class="btn-hover"
      >
        查看历史记录
      </button>
      <button 
        class="action-btn back-btn"
        @click="backToHome"
        hover-class="btn-hover"
      >
        返回首页
      </button>
    </view>
  </view>
</template>

<script>
const DEFAULT_ADVICE = {
  high: [
    '建议每周至少进行150分钟中等强度有氧运动',
    '每日钠摄入量控制在2000mg以下',
    '定期监测晨起静息血压',
    '建议每月进行1次血脂检测',
    '保持BMI指数在18.5-24之间'
  ],
  low: [
    '保持每周3次以上有氧运动',
    '每日蔬菜摄入量不少于500克',
    '每半年进行一次全面体检',
    '控制饱和脂肪酸摄入量',
    '保持规律作息时间'
  ]
};

export default {
  data() {
    return {
      riskLevel: 'High',
      healthData: {},
      chartWidth: 0,
      chartHeight: 0,
      chartData: {
        labels: ['总胆固醇', '收缩压', '舒张压', 'BMI', '心率', '血糖'],
        values: [],
        normalRanges: [
          { min: 100,   max: 240, unit: 'mg/dL' },
          { min: 90,  max: 120, unit: 'mmHg' },
          { min: 60,  max: 80,  unit: 'mmHg' },
          { min: 18.5,max: 24.9,unit: 'kg/m²' },
          { min: 60,  max: 100, unit: 'bpm' },
          { min: 70,  max: 110, unit: 'mg/dL' }
        ]
      }
    };
  },
  computed: {
    resultClass() {
      return this.riskLevel === 'High' ? 'high-risk' : 'low-risk';
    },
    adviceList() {
      return DEFAULT_ADVICE[this.riskLevel.toLowerCase()];
    }
  },
  onLoad(options) {
    this.riskLevel  = decodeURIComponent(options.risk  || 'High');
    try {
      this.healthData = JSON.parse(decodeURIComponent(options.healthData || '{}'));
    } catch {
      this.healthData = {};
    }
    this.initChartData();
  },
  onReady() {
    const sys = uni.getSystemInfoSync();
    this.chartWidth  = sys.windowWidth * 0.85;
    this.chartHeight = this.chartData.labels.length * 100 - 100;
    console.log('画布尺寸:', this.chartWidth, this.chartHeight);
    
      // 延迟执行绘制，确保canvas渲染完成
      setTimeout(() => {
        this.drawChart();
      }, 100);
  },
  methods: {
    initChartData() {
      const d = this.healthData;
      this.chartData.values = [
        d.totChol   || 0,
        d.sysBP     || 0,
        d.diaBP     || 0,
        d.BMI       || 0,
        d.heartRate || 0,
        d.glucose   || 0
      ];
    },
    drawChart() {
      const ctx = uni.createCanvasContext('chartCanvas', this);
      const w   = this.chartWidth;
      const h   = this.chartHeight;
      const itemH = 80;
      const startY = 30;

      ctx.clearRect(0, 0, w, h);

      this.chartData.labels.forEach((label, i) => {
        const y = startY + i * itemH;
        const val = this.chartData.values[i];
        const { min, max, unit } = this.chartData.normalRanges[i];
        const range = max - min;
        const normLen = ((max - min) / range) * (w - 40);
        let valPos = ((val - min) / range) * (w - 40);
        if (valPos < 0) valPos = 0;
        if (valPos > (w - 40)) valPos = w - 40;

        // 背景线
        ctx.setStrokeStyle('#eeeeee');
        ctx.beginPath();
        ctx.moveTo(20, y + 25);
        ctx.lineTo(w - 20, y + 25);
        ctx.stroke();

        // 正常范围背景
        ctx.setFillStyle('#e8f5e9');
        ctx.fillRect(20, y + 15, w - 40, 20);

        // 当前值圆点
        ctx.setFillStyle(val < min || val > max ? '#ff4444' : '#1aad19');
        ctx.beginPath();
        ctx.arc(20 + valPos, y + 25, 8, 0, 2 * Math.PI);
        ctx.fill();

        // 指标名
        ctx.setFontSize(14);
        ctx.setFillStyle('#333');
        ctx.setTextAlign('left');
        ctx.fillText(label, 20, y);

        // 值 + 单位
        ctx.setTextAlign('right');
        ctx.setFontSize(16);
        ctx.fillText(`${val} ${unit}`, w - 20, y);

        // 范围标注
        ctx.setTextAlign('left');
        ctx.setFontSize(12);
        ctx.setFillStyle('#999');
        ctx.fillText(`${min}${unit}`, 20, y + 50);
        ctx.setTextAlign('right');
        ctx.fillText(`${max}${unit}`, w - 20, y + 50);
      });

      // 图例
      // ctx.setFontSize(14);
      // ctx.setTextAlign('left');
      // ctx.setFillStyle('#1aad19');
      // ctx.fillText('正常范围', 20, h - 30);
      // ctx.setFillStyle('#ff4444');
      // ctx.fillText('异常指标', w / 2 + 20, h - 30);

      ctx.draw();
    },
    backToHome() {
      uni.switchTab({ url: '/pages/index/index' });
    },
    goToHistory() {
      uni.navigateTo({
        url: `/pages/history/history?username=${this.healthData.username || ''}`
      });
    }
  }
};
</script>

<style lang="scss">
$result-padding: 40rpx;
$card-bg: #fff;

.result-container {
  padding: $result-padding;
  background: #f8f9fa;
  min-height: 100vh;
}

.result-header {
  text-align: center;
  margin-bottom: 60rpx;
  .result-title {
    font-size: 44rpx;
    font-weight: 600;
    color: #2c3e50;
  }
  .risk-indicator {
    margin-top: 24rpx;
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    padding: 8rpx 24rpx;
    border-radius: 40rpx;
    background: rgba(#ff4444, 0.1);

    &.low-risk { background: rgba(#1aad19, 0.1); }

    .risk-label {
      font-size: 32rpx;
      font-weight: 500;
      color: #ff4444;

      .low-risk & { color: #1aad19; }
    }
  }
}

.chart-card {
  background: $card-bg;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.04);
  margin-bottom: 40rpx;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    .chart-title {
      font-size: 34rpx;
      font-weight: 500;
      color: #2c3e50;
    }
    .chart-legend {
      display: flex;
      gap: 32rpx;
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        font-size: 24rpx;
        color: #666;
        view {
          width: 24rpx;
          height: 24rpx;
          border-radius: 4rpx;
          &.legend-normal { background: #1aad19; }
          &.legend-abnormal { background: #ff4444; }
        }
      }
    }
  }

  .chart-canvas {
    display: block;
    width: 100%;
    margin: 0 auto;
  }
}

.advice-card {
  background: $card-bg;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.04);
  margin-bottom: 40rpx;
  .card-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 32rpx;
    .card-title {
      font-size: 34rpx;
      font-weight: 500;
      color: #2c3e50;
    }
  }
  .advice-content {
    .advice-item {
      display: block;
      padding: 24rpx 0;
      font-size: 28rpx;
      color: #444;
      line-height: 1.6;
      border-bottom: 1rpx solid #eee;
      &:last-child { border-bottom: none; }
    }
  }
}

.action-buttons {
  margin-top: 60rpx;
  display: grid;
  gap: 32rpx;
  .action-btn {
    height: 96rpx;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    &.history-btn {
      background: linear-gradient(135deg, #666, #444);
      color: #fff;
    }
    &.back-btn {
      background: linear-gradient(135deg, #1aad19, darken(#1aad19, 8%));
      color: #fff;
    }
    &.btn-hover {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}
</style>
