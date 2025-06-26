<template>
  <view class="cloud-container">
    <view class="card">
      <text class="title">高血压常见问题词云图</text>

      <image 
        v-if="imgUrl" 
        :src="imgUrl" 
        mode="widthFix" 
        class="cloud-img"
      />

      <view v-else class="loading">正在加载词云图...</view>

      <button 
        class="refresh-btn"
        :disabled="loading"
        @click="fetchWordcloud"
      >
        {{ loading ? '加载中...' : '刷新词云' }}
      </button>

      <view v-if="analysis" class="analysis-container">
        <text class="analysis-title">词云分析</text>
        <scroll-view class="analysis-text" scroll-y>
          <text>{{ analysis }}</text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: '',
      analysis: '',
      loading: false,
    }
  },
  onLoad() {
    this.fetchWordcloud()
  },
  methods: {
    fetchWordcloud() {
      this.loading = true
      uni.request({
        url: 'http://localhost:5000/wordcloud',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data.image_url) {
            this.imgUrl = 'http://localhost:5000' + res.data.image_url
            this.analysis = res.data.analysis || '暂无分析内容'
          } else {
            uni.showToast({ title: '词云加载失败', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '请求失败', icon: 'none' })
        },
        complete: () => {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.cloud-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
  box-sizing: border-box;
}

.card {
  background: #fff;
  padding: 40rpx 30rpx;
  border-radius: 30rpx;
  box-shadow: 0 15rpx 30rpx rgba(0,0,0,0.1);
  width: 100%;
  max-width: 720rpx;
  text-align: center;
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 30rpx;
}

.cloud-img {
  max-width: 100%;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 20rpx rgba(0,0,0,0.1);
  margin-bottom: 20rpx;
}

.loading {
  font-size: 30rpx;
  color: #999;
  padding: 60rpx 0;
}

.refresh-btn {
  background-color: #00b578;
  color: #fff;
  font-size: 30rpx;
  padding: 20rpx 40rpx;
  border-radius: 40rpx;
  margin: 20rpx 0;
  user-select: none;
}

.refresh-btn:disabled {
  background-color: #ccc;
}

.analysis-container {
  text-align: left;
  margin-top: 20rpx;
  max-height: 300rpx;
  border: 1rpx solid #ddd;
  border-radius: 20rpx;
  padding: 20rpx;
  background: #fafafa;
  overflow: hidden;
}

.analysis-title {
  font-weight: 600;
  font-size: 32rpx;
  color: #333;
  margin-bottom: 15rpx;
}

.analysis-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  max-height: 250rpx;
  overflow-y: scroll;
  white-space: normal;
}
</style>
