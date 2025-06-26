<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">{{ username }}的健康数据趋势</text>
    </view>

    <!-- 主滚动容器 -->
    <scroll-view 
      class="main-scroll"
      scroll-y
      :style="{ height: scrollViewHeight + 'px',paddingBottom: safeAreaBottom + 'px' }"
    >
      <!-- 每个指标图表 -->
      <view 
        v-for="(dataset, index) in chartData.datasets" 
        :key="index" 
        class="chart-container"
      >
        <scroll-view scroll-x class="chart-scroll">
          <canvas 
            :canvas-id="'chart' + index"
            :id="'chart' + index"
            class="chart-canvas"
            :style="{ 
              width: chartContentWidth + 'px',
              height: chartHeight + 'px'
            }"
          ></canvas>
        </scroll-view>
        
        <!-- 数值提示框 -->
        <view 
          v-if="activePoints[index]"
          class="tooltip"
          :style="{
            left: activePoints[index].x + 'px',
            top: activePoints[index].y + 'px'
          }"
        >
          {{ activePoints[index].value + dataset.unit }}
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作按钮 -->
    <view class="action-btns" :style="{ bottom: safeAreaBottom + 'px' }">
      <button class="btn" @click="backToHome">返回首页</button>
      <button class="btn" @click="refreshData">刷新数据</button>
    </view>

    <!-- 加载提示 -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <image class="loading-icon" src="/static/loading.gif" />
        <text class="loading-text">数据加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      chartWidth: 300,
      chartHeight: 290,
      chartContentWidth: 800,
      scrollViewHeight: 600,
      username: '',
      loading: false,
      activePoints: [],
	  safeAreaBottom: 0, // 新增安全边距
      chartData: {
        dates: [],
        datasets: [
          { label: '总胆固醇', unit: 'mg/dL', values: [], color: '#4CAF50' },
          { label: '收缩压', unit: 'mmHg', values: [], color: '#2196F3' },
          { label: '舒张压', unit: 'mmHg', values: [], color: '#FFC107' },
          { label: 'BMI', unit: 'kg/m²', values: [], color: '#9C27B0' },
          { label: '心率', unit: 'bpm', values: [], color: '#FF5722' },
          { label: '血糖', unit: 'mmol/L', values: [], color: '#795548' }
        ]
      }
    }
  },

  onLoad() {
    this.initPage()
  },

  methods: {
    async initPage() {
      this.checkLogin()
      this.calcDimensions()
      await this.loadHealthData()
    },

    checkLogin() {
      this.username = uni.getStorageSync('username')
      if (!this.username) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        setTimeout(() => uni.reLaunch({ url: '/pages/login/login' }), 1500)
        return false
      }
      return true
    },

    calcDimensions() {
          const systemInfo = uni.getSystemInfoSync()
          
          // 计算安全区域（修复未调用问题）
          this.safeAreaBottom = systemInfo.safeArea?.bottom 
            ? systemInfo.screenHeight - systemInfo.safeArea.bottom
            : 0
    
          // 动态计算滚动区域高度
          const btnAreaHeight = 120 // 按钮区域高度（rpx换算后）
          this.scrollViewHeight = systemInfo.windowHeight
            - btnAreaHeight 
            - this.safeAreaBottom
    
          // 图表尺寸计算
          this.chartWidth = systemInfo.windowWidth * 0.95
          this.chartContentWidth = Math.max(this.chartWidth * 1.5, 800)
        },

    async loadHealthData() {
      if (!this.checkLogin()) return
      
      this.loading = true
      try {
        const { data } = await uni.request({
          url: 'http://localhost:5000/get_history',
          method: 'POST',
          data: { username: this.username },
          timeout: 10000
        })

        if (data.error) throw new Error(data.error)
        if (!data.history?.length) throw new Error('暂无历史数据')

        this.processData(data.history)
        this.$nextTick(() => {
          this.chartData.datasets.forEach((d, i) => this.drawChart(d, i))
          this.bindTouchEvents()
        })
      } catch (error) {
        uni.showToast({ title: error.message, icon: 'none' })
      } finally {
        this.loading = false
      }
    },

    processData(history) {
      this.chartData.dates = history.map(item => 
        item.date.split('-').slice(1).join('/')
      )
      
      const keys = ['totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']
      this.chartData.datasets.forEach((d, i) => {
        d.values = history.map(item => Number(item[keys[i]]) || 0)
      })
    },

    drawChart(dataset, index) {
      const ctx = uni.createCanvasContext(`chart${index}`, this)
      const { dates } = this.chartData
      const { values, label, color, unit } = dataset
      
      ctx.clearRect(0, 0, this.chartContentWidth, this.chartHeight)
      
      // 坐标系参数
      const margin = { top: 25, right: 15, bottom: 155, left: 40 }
      const plotWidth = this.chartContentWidth - margin.left - margin.right
      const plotHeight = this.chartHeight - margin.top - margin.bottom

      // 数值范围计算
      const maxVal = Math.max(...values) * 1.05 || 1
      const minVal = Math.min(...values) * 0.95
      const range = maxVal - minVal

      // 绘制坐标轴
      ctx.setStrokeStyle('#666')
      ctx.setLineWidth(1)
      
      // Y轴
      ctx.beginPath()
      ctx.moveTo(margin.left, margin.top)
      ctx.lineTo(margin.left, margin.top + plotHeight)
      ctx.stroke()

      // X轴
      ctx.beginPath()
      ctx.moveTo(margin.left, margin.top + plotHeight)
      ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight)
      ctx.stroke()

      // 绘制刻度标签
      ctx.setFontSize(10)
      ctx.setFillStyle('#666')
      
      // Y轴刻度
      ctx.setTextAlign('right')
      ;[0, 0.25, 0.5, 0.75, 1].forEach(ratio => {
        const y = margin.top + plotHeight * (1 - ratio)
        const value = (minVal + range * ratio).toFixed(1)
        
        ctx.beginPath()
        ctx.moveTo(margin.left - 5, y)
        ctx.lineTo(margin.left, y)
        ctx.stroke()
        
        ctx.fillText(value, margin.left - 8, y + 3)
      })

      // X轴日期
      ctx.setTextAlign('center')
      dates.forEach((date, i) => {
        if (i % 2 !== 0) return
        const x = margin.left + (plotWidth / (dates.length - 1)) * i
        ctx.fillText(date, x, margin.top + plotHeight + 15)
      })

      // 绘制数据线
      ctx.beginPath()
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(1.5)
      
      values.forEach((val, i) => {
        const x = margin.left + (plotWidth / (values.length - 1)) * i
        const y = margin.top + plotHeight * (1 - (val - minVal)/range)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // 绘制数据点及数值
      values.forEach((val, i) => {
        const x = margin.left + (plotWidth / (values.length - 1)) * i
        const y = margin.top + plotHeight * (1 - (val - minVal)/range)
        
        // 数据点
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.setFillStyle(color)
        ctx.fill()
        
        // 数值标签
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText(val.toFixed(1), x, y - 8)
      })

      // 标题
      ctx.setFontSize(12)
      ctx.setTextAlign('left')
      ctx.fillText(`${label} (${unit})`, margin.left + 5, margin.top - 5)

      ctx.draw()
    },

    bindTouchEvents() {
      this.chartData.datasets.forEach((d, index) => {
        const query = uni.createSelectorQuery().in(this)
        query.select(`#chart${index}`).boundingClientRect()
        
        query.exec(res => {
          const canvas = res[0]
          if (!canvas) return
          
          let lastX = 0
          uni.getSystemInfoSync().platform === 'android' && (lastX = -1)
          
          // 触摸事件处理
          let touching = false
          this.$el.addEventListener('touchstart', () => touching = true)
          this.$el.addEventListener('touchend', () => touching = false)
          
          this.$el.addEventListener('touchmove', (e) => {
            if (!touching) return
            
            const touchX = e.touches[0].clientX - canvas.left
            const touchY = e.touches[0].clientY - canvas.top
            const point = this.findNearestPoint(touchX, index)
            
            if (point) {
              this.$set(this.activePoints, index, {
                x: point.x + 15,
                y: point.y - 25,
                value: point.value
              })
            }
          })
        })
      })
    },

    findNearestPoint(x, index) {
      const { chartData, chartContentWidth } = this
      const dataset = chartData.datasets[index]
      const margin = { left: 40, right: 15 }
      const plotWidth = chartContentWidth - margin.left - margin.right
      
      const step = plotWidth / (dataset.values.length - 1)
      const idx = Math.min(dataset.values.length - 1, Math.max(0, 
        Math.round((x - margin.left) / step)
      ))
      
      const maxVal = Math.max(...dataset.values) * 1.05
      const minVal = Math.min(...dataset.values) * 0.95
      const value = dataset.values[idx]
      
      return {
        x: margin.left + idx * step,
        y: margin.top + (this.chartHeight - margin.top - 35) * 
          (1 - (value - minVal)/(maxVal - minVal)),
        value: value.toFixed(1)
      }
    },

    backToHome() {
      uni.navigateTo({ url: '/pages/index/index' })
    },

    refreshData() {
      this.loadHealthData()
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background: #f8f9fa;
  min-height: 100vh;

  .header {
    padding: 30rpx 0;
    text-align: center;

    .title {
      font-size: 36rpx;
      color: #2c3e50;
      font-weight: 600;
    }
  }

  .main-scroll {
    padding: 20rpx 0;
	box-sizing: content-box; /* 保证padding影响布局 */
  }

  .chart-container {
    position: relative;
    margin: 20rpx 25rpx;
    background: white;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 10px;
    
    .chart-scroll {
      height: 320rpx;
    }
  }

  .tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    pointer-events: none;
    transform: translateY(-50%);
    white-space: nowrap;
    
    &::after {
      content: '';
      position: absolute;
      left: -8rpx;
      top: 50%;
      border: 8rpx solid transparent;
      border-right-color: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%);
    }
  }

  .action-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent 0%, white 30%);
    padding: 20rpx 25rpx;
    z-index: 100;
	/* 新增间距控制 */
	box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .btn {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: white;
      background: #1aad19;
      border-radius: 45rpx;
      margin-bottom: 10rpx;
      transition: opacity 0.3s;

      &:active {
        opacity: 0.8;
      }
    }
  }

  .loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;

    .loading-content {
      text-align: center;

      .loading-icon {
        width: 80rpx;
        height: 80rpx;
      }

      .loading-text {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-top: 20rpx;
      }
    }
  }
}
</style>