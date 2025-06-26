<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">AI健康助手</text>
      <view style="display: flex; gap: 20rpx;">
        <button class="cloud-btn" @click="goToWordCloud">词云图</button>
        <button class="clear-btn" @click="clearHistory">清空记录</button>
      </view>
    </view>


    <!-- 对话区域 -->
    <scroll-view 
      class="chat-area" 
      scroll-y 
      :scroll-top="scrollTop"
      scroll-with-animation
    >
      <view 
        v-for="(msg, index) in messages" 
        :key="index" 
        class="message-wrap"
        :class="{ 'user-message': msg.role === 'user' }"
      >
        <view class="message-bubble">
          <text class="role-tag">{{ msg.role === 'user' ? '我' : 'AI' }}</text>
          <text class="message-content">{{ msg.content }}</text>
          <text class="time">{{ msg.time }}</text>
        </view>
      </view>
      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">AI正在思考中...</text>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input
        class="input"
        v-model="inputMessage"
        placeholder="输入健康问题..."
        placeholder-class="placeholder"
        :focus="autoFocus"
        @confirm="sendMessage"
      />
      <button 
        class="send-btn" 
        :disabled="loading || !isLoggedIn"
        @click="sendMessage"
      >
        {{ isLoggedIn ? '发送' : '请先登录' }}
      </button>
    </view>
  </view>
</template>

<script>
const API_BASE = 'http://localhost:5000'

export default {
  data() {
    return {
      messages: [],
      inputMessage: '',
      loading: false,
      scrollTop: 0,
      autoFocus: true,
      username: ''
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.username
    }
  },
  mounted() {
    this.loadSession()
    this.loadHistory()
  },
  methods: {
    async loadSession() {
      try {
        this.username = uni.getStorageSync('username')
      } catch (error) {
        console.log('未找到登录信息')
      }
    },

    async sendMessage() {
      if (!this.validateInput()) return

      const userMsg = {
        role: 'user',
        content: this.inputMessage,
        time: this.getCurrentTime()
      }
      this.messages.push(userMsg)
      this.inputMessage = ''

      try {
        this.loading = true
        const res = await uni.request({
          url: `${API_BASE}/ask_ai`,
          method: 'POST',
          data: {
            username: this.username,
            question: userMsg.content
          }
        })

        if (res.statusCode === 200) {
          this.messages.push({
            role: 'assistant',
            content: res.data.answer,
            time: this.getCurrentTime()
          })
        }
      } catch (error) {
        uni.showToast({ title: '请求失败，请重试', icon: 'none' })
      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },

    validateInput() {
      if (!this.username) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return false
      }
      return !!this.inputMessage.trim()
    },

    async loadHistory() {
      if (!this.username) return

      try {
        const res = await uni.request({
          url: `${API_BASE}/ai_history`,
          method: 'POST',
          data: {
            username: this.username
          }
        })

        if (res.statusCode === 200) {
          this.messages = res.data.history.map(item => ({
            role: 'assistant',
            content: item.answer,
            time: item.time
          }))
        }
      } catch (error) {
        console.error('加载历史失败:', error)
      }
    },

    clearHistory() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有对话记录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await uni.request({
                url: `${API_BASE}/clear_ai_history`,
                method: 'POST',
                data: {
                  username: this.username
                }
              })
              this.messages = []
            } catch (error) {
              console.error('清空失败:', error)
            }
          }
        }
      })
    },

    getCurrentTime() {
      const now = new Date()
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    },
	goToWordCloud() {
	  uni.navigateTo({
	    url: '/pages/wordcloud/wordcloud'  // 根据你项目目录调整路径
	  })
	},


    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = this.messages.length * 1000
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  height: 100vh;
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  .clear-btn {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx 20rpx;
    border-radius: 30rpx;
    background: #fff;
  }
}

.chat-area {
  height: calc(100vh - 300rpx);
  padding: 20rpx 0;
}

.cloud-btn {
  font-size: 28rpx;
  color: #666;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  background: #fff;
}


.message-wrap {
  margin: 20rpx;
  display: flex;
  &.user-message {
    justify-content: flex-end;
    .message-bubble {
      background: #95ec69;
      border-radius: 20rpx 20rpx 0 20rpx;
    }
  }
}

.message-bubble {
  max-width: 70%;
  padding: 20rpx;
  background: #fff;
  border-radius: 20rpx 20rpx 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  .role-tag {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 10rpx;
  }
  .message-content {
    font-size: 30rpx;
    color: #333;
    line-height: 1.5;
  }
  .time {
    display: block;
    font-size: 24rpx;
    color: #999;
    text-align: right;
    margin-top: 10rpx;
  }
}

.loading-wrap {
  text-align: center;
  padding: 20rpx;
  .loading-text {
    color: #999;
    font-size: 28rpx;
  }
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  .input {
    flex: 1;
    background: #f5f7fa;
    border-radius: 40rpx;
    padding: 20rpx 30rpx;
    margin-right: 20rpx;
    font-size: 30rpx;
  }
  .send-btn {
    width: 140rpx;
    background: #00b578;
    color: #fff;
    border-radius: 40rpx;
    font-size: 30rpx;
    &[disabled] {
      background: #ccc;
    }
  }
}

.placeholder {
  color: #999;
}
</style>