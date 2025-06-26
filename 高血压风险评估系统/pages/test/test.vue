<template>
  <view class="container">
    <!-- 数据概览 -->
    <view class="stats-grid">
      <view class="stat-card" v-for="(item, key) in summary" :key="key">
        <text class="stat-value">{{ formatStatValue(key, item) }}</text>
        <text class="stat-label">{{ statLabels[key] }}</text>
      </view>
    </view>

    <!-- 风险分布 -->
    <!-- 风险分布 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">风险分布</text>
            <segmented-control
             :values="['性别分布', '年龄分布']"
             @clickItem="handleRiskTypeChange"
             :current="currentRiskType" 
            />

      </view>
      <canvas
        canvas-id="riskChart"
        class="chart-canvas"
        :style="{ width: chartContentWidth + 'px', height: chartHeight + 'px' }"
      />
      <!-- 这里你可以用普通view渲染图例 -->
      <view class="legend">
        <view
          v-for="(item, index) in getRiskData()"
          :key="index"
          class="legend-item"
        >
          <view
            class="legend-color"
            :style="{ backgroundColor: getColor(index) }"
          />
          <text>{{ item.label }} ({{ item.count }})</text>
        </view>
      </view>
    </view>


    <!-- BMI 与血压 -->
    <view class="chart-row">
      <view class="chart-col">
        <view class="chart-card">
          <text class="chart-title">BMI 分布</text>
          <scroll-view scroll-x class="chart-scroll">
            <canvas
              canvas-id="bmiChart"
              class="chart-canvas"
              :style="{ width: chartContentWidth + 'px', height: chartHeight + 'px' }"
            />
          </scroll-view>
        </view>
      </view>
      <view class="chart-col">
        <view class="chart-card">
          <text class="chart-title">血压指标</text>
          <scroll-view scroll-x class="chart-scroll">
            <canvas
              canvas-id="bpChart"
              class="chart-canvas"
              :style="{ width: chartContentWidth + 'px', height: chartHeight + 'px' }"
            />
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <image class="loading-icon" src="/static/loading.gif" />
        <text class="loading-text">数据加载中...</text>
      </view>
    </view>
  </view>
</template>


<script>
import SegmentedControl from '@/pages/components/segmented-control.vue';
const API_BASE = 'http://localhost:5000';

export default {
  components: { SegmentedControl },
  data() {
    return {
      chartHeight: 300,
      chartContentWidth: 800,
      loading: false,
      currentRiskType: 0,
      summary: {
        total: 0,
        high_risk_ratio: 0,
        avg_age: 0,
        smoker_ratio: 0
      },
      statLabels: {
        total: '总样本数',
        high_risk_ratio: '高风险比例',
        avg_age: '平均年龄',
        smoker_ratio: '吸烟者占比'
      },
      chartData: {
        riskByGender: [],
        riskByAge: [],
        bmi: [],
        bp: { avg_sys_bp: 0, avg_dia_bp: 0 }
      }
    }
  },
  mounted() {
    this.calcDimensions();
    this.loadData();
  },
  methods: {
    calcDimensions() {
      const sys = uni.getSystemInfoSync();
      this.chartContentWidth = sys.windowWidth * 2;
      this.chartHeight = sys.windowHeight * 0.4;
    },

    formatStatValue(key, value) {
      if (key.endsWith('_ratio')) return `${(value).toFixed(1)}%`;
      if (key === 'avg_age') return value.toFixed(1);
      return value;
    },

    async loadData() {
      this.loading = true;
      try {
        const [summaryRes, riskRes, bmiRes, bpRes] = await Promise.all([
          uni.request({ url: `${API_BASE}/analysis/summary` }),
          uni.request({ url: `${API_BASE}/analysis/risk_distribution` }),
          uni.request({ url: `${API_BASE}/analysis/bmi_distribution` }),
          uni.request({ url: `${API_BASE}/analysis/indicators` })
        ]);

        this.summary = {
          total: this.safeNumber(summaryRes.data.data?.total),
          high_risk_ratio: this.safeNumber(summaryRes.data.data?.high_risk_ratio),
          avg_age: this.safeNumber(summaryRes.data.data?.avg_age),
          smoker_ratio: this.safeNumber(summaryRes.data.data?.smoker_ratio)
        };

        this.chartData = {
          riskByGender: this.processPieData(riskRes.data.data?.by_gender, 'gender'),
          riskByAge: this.processPieData(riskRes.data.data?.by_age, 'range'),
          bmi: this.processBarData(bmiRes.data.data, 'category'),
          bp: {
            avg_sys_bp: this.safeNumber(bpRes.data.data?.avg_sys_bp),
            avg_dia_bp: this.safeNumber(bpRes.data.data?.avg_dia_bp)
          }
        };

        await this.$nextTick();
        this.drawAllCharts();
      } catch (err) {
        console.error('加载失败:', err);
        uni.showToast({ title: '数据加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },

    safeNumber(val) {
      const n = typeof val === 'string' ? parseFloat(val) : Number(val);
      return isNaN(n) ? 0 : n;
    },

    processPieData(data, key) {
      return (data || []).map(item => ({
        label: item[key] || '未知',
        count: this.safeNumber(item.count)
      }));
    },

    processBarData(data, key) {
      return (data || []).map(item => ({
        label: item[key] || '未知',
        count: this.safeNumber(item.count)
      }));
    },

    handleRiskTypeChange(index) {
      this.currentRiskType = index;
      this.$nextTick(() => {
        this.drawPieChart('riskChart', this.getRiskData());
      });
    },

    getRiskData() {
      return this.currentRiskType === 0
        ? this.chartData.riskByGender
        : this.chartData.riskByAge;
    },

    drawAllCharts() {
      this.drawPieChart('riskChart', this.getRiskData());
      this.drawBarChart('bmiChart', this.chartData.bmi, 'BMI分类');
      this.drawBarChart('bpChart', [
        { label: '收缩压', count: this.chartData.bp.avg_sys_bp },
        { label: '舒张压', count: this.chartData.bp.avg_dia_bp }
      ], '血压 (mmHg)');
    },

    calcDimensions() {
      const sys = uni.getSystemInfoSync();
      this.chartContentWidth = sys.windowWidth; // 直接屏幕宽度，避免横向滚动
      this.chartHeight = sys.windowWidth * 0.6; // 高度按宽度比例，保证正方形画布
    },
    
    drawPieChart(id, data) {
      const ctx = uni.createCanvasContext(id, this);
      const cx = this.chartContentWidth / 2;
      const cy = this.chartHeight / 2;
      const radius = Math.min(cx, cy) * 0.7; // 半径小于画布的一半，避免超出
      let start = 0;
      const total = data.reduce((s, d) => s + d.count, 0);
    
      data.forEach((d, i) => {
        const angle = (d.count / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, start + angle);
        ctx.closePath();
        ctx.setFillStyle(this.getColor(i));
        ctx.fill();
        start += angle;
      });
    
      // 绘制图例改为vue层面渲染（更灵活，避免超出）
      ctx.draw();
    },


    drawBarChart(id, data, yLabel = '') {
      const ctx = uni.createCanvasContext(id, this);
      const margin = 40;
      const axisY = this.chartHeight - margin;
      const max = Math.max(...data.map(d => d.count)) || 1;
      const barWidth = 30;
      const gap = 30;

      // Y轴刻度
      ctx.setStrokeStyle('#ccc');
      ctx.setFontSize(12);
      for (let i = 0; i <= 5; i++) {
        const y = axisY - (this.chartHeight - margin * 2) * i / 5;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(this.chartContentWidth - margin, y);
        ctx.stroke();
        ctx.fillText((max * i / 5).toFixed(0), 5, y + 4);
      }

      // 柱状图
      data.forEach((d, i) => {
        const x = margin + i * (barWidth + gap);
        const h = (d.count / max) * (this.chartHeight - margin * 2);
        ctx.setFillStyle(this.getColor(i));
        ctx.fillRect(x, axisY - h, barWidth, h);

        // x轴标签
        ctx.setFillStyle('#333');
        ctx.fillText(d.label, x, axisY + 14);
      });

      // Y轴标题（可选）
      if (yLabel) {
        ctx.save();
        ctx.translate(12, this.chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.setFillStyle('#999');
        ctx.setFontSize(12);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
      }

      ctx.draw();
    },

    getColor(i) {
      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272'];
      return colors[i % colors.length];
    }
  }
}
</script>


<style>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  justify-content: center;
  margin-top: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #555;
}

.legend-color {
  width: 28rpx;
  height: 28rpx;
  border-radius: 6rpx;
}

.container {
  padding: 20rpx;
}
.chart-card {
  background: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
.chart-title {
  font-size: 32rpx;
  margin-bottom: 20rpx;
  font-weight: bold;
}
.chart-canvas {
  width: 100%;
}
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.stat-card {
  background: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}
.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #2c3e50;
}
.stat-label {
  font-size: 26rpx;
  color: #666;
}
.bp-card {
  background: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.bp-values text {
  display: block;
  font-size: 28rpx;
  color: #444;
  margin-bottom: 10rpx;
}
</style>
