<template>
  <view class="container">
    <!-- 动态背景 -->
    <view class="background-effect"></view>
    
    <!-- 顶部导航 -->
    <view class="header">
      <image class="avatar" src="/static/avatar.png" mode="aspectFill" />
      <text class="greeting">下午好，{{ username }}</text>
      <view class="health-status">
        <text class="status-icon">❤️</text>
        <text class="status-text">健康状态良好</text>
      </view>
    </view>

    <!-- 数据概览卡片 -->
    <view class="dashboard">
      <view class="card health-score">
        <text class="card-title">健康指数</text>
        <text class="score">92</text>
        <view class="progress-bar">
          <view class="progress" :style="{width: '92%'}"></view>
        </view>
      </view>

      <view class="card recent-data" style="width: 300rpx;">
        <text class="card-title">最新数据</text>
        <view class="data-grid">
          <view class="data-item">
            <text class="value">120/80</text>
            <text class="label">血压</text>
          </view>
          <view class="data-item">
            <text class="value">5.2</text>
            <text class="label">血糖</text>
          </view>
          <view class="data-item">
            <text class="value">75</text>
            <text class="label">心率</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="quick-actions">
      <view class="action-card" @click="goToPredict">
        <image class="action-icon" src="/static/predict.png" />
        <text class="action-text">健康检测</text>
        <text class="action-desc">立即进行健康评估</text>
      </view>

      <view class="action-card" @click="goToHistory">
        <image class="action-icon" src="/static/history.png" />
        <text class="action-text">数据追踪</text>
        <text class="action-desc">查看历史趋势</text>
      </view>

      <view class="action-card" @click="goToAdvice">
        <image class="action-icon" src="/static/advice.png" />
        <text class="action-text">健康建议</text>
        <text class="action-desc">获取专业指导</text>
      </view>
	  <!-- 在首页添加导航入口 -->
	  <view class="action-card" @click="goToAnalysis">
	    <image class="action-icon" src="/static/analysis.png" />
	    <text class="action-text">数据分析</text>
	    <text class="action-desc">高血压现状</text>
	  </view>
	  
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: "用户"
    }
  },
  onLoad() {
    this.username = uni.getStorageSync('username') || "用户"
  },
  methods: {
    goToPredict() {
      uni.navigateTo({ url: '/pages/predict/predict' })
    },
    goToHistory() {
      uni.navigateTo({ url: '/pages/history/history' })
    },
	goToAdvice() {
	  uni.navigateTo({ url: '/pages/advice/advice' })
	},
	goToAnalysis() {
	  uni.navigateTo({ url: '/pages/analysis/analysis' })
	}
  }
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

.background-effect {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(-45deg, #e6e9f0 0%, #eef1f5 100%);
  z-index: -1;
}

.header {
  padding: 40rpx;
  background: rgba(255,255,255,0.9);
  border-radius: 24rpx;
  margin: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.05);
  
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 20rpx;
  }
  
  .greeting {
    display: block;
    font-size: 40rpx;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 16rpx;
  }
  
  .health-status {
    display: flex;
    align-items: center;
    .status-icon {
      font-size: 36rpx;
      margin-right: 12rpx;
    }
    .status-text {
      color: #4CAF50;
      font-size: 28rpx;
    }
  }
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin: 20rpx;
  
  .card {
    background: white;
    padding: 32rpx;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
    
    &.health-score {
      grid-column: span 2;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      
      .score {
        font-size: 72rpx;
        font-weight: 700;
        margin: 20rpx 0;
      }
      
      .progress-bar {
        height: 12rpx;
        background: rgba(255,255,255,0.3);
        border-radius: 6rpx;
        overflow: hidden;
        
        .progress {
          height: 100%;
          background: white;
          transition: width 0.5s ease;
        }
      }
    }
    
    .card-title {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
    }
    
    .data-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;
      
      .data-item {
        text-align: center;
        .value {
          font-size: 36rpx;
          font-weight: 600;
          color: #2196F3;
        }
        .label {
          color: #666;
          font-size: 24rpx;
        }
      }
    }
  }
}

.quick-actions {
  margin: 20rpx;
  
  .action-card {
    background: white;
    padding: 32rpx;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    transition: transform 0.2s ease;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
    
    &:active {
      transform: scale(0.98);
    }
    
    .action-icon {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 20rpx;
    }
    
    .action-text {
      display: block;
      font-size: 32rpx;
      color: #2c3e50;
      font-weight: 600;
    }
    
    .action-desc {
      color: #666;
      font-size: 24rpx;
    }
  }
}
</style>