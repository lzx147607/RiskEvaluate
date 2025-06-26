<template>
	<view class="container">
	  <view class="login-wrapper">
	    <view class="login-header">
	      <text class="title">欢迎回来</text>
	      <text class="subtitle">请登录您的账户</text>
	    </view>
	    
	    <view class="login-form">
	      <form @submit="onSubmit">
	        <view class="form-item">
	          <input 
	            class="input" 
	            name="username" 
	            type="text" 
	            placeholder="用户名"
	            placeholder-class="placeholder-style"
	          />
	          <uni-icons class="input-icon" type="person" size="20" color="#999" />
	        </view>
	        
	        <view class="form-item">
	          <input 
	            class="input" 
	            name="password" 
	            type="password" 
	            placeholder="密码"
	            placeholder-class="placeholder-style"
	          />
	          <uni-icons class="input-icon" type="locked" size="20" color="#999" />
	        </view>
	        
	        <button 
	          form-type="submit" 
	          class="submit-btn"
	          hover-class="submit-btn-hover"
	        >
	          立即登录
	        </button>
	        
	        <view class="action-links">
	          <text class="register-text">新用户？</text>
	          <text class="register-link" @click="goToRegister">快速注册</text>
	          <text class="divider">|</text>
	          <text class="forgot-link">忘记密码？</text>
	        </view>
	      </form>
	    </view>
	  </view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 用于存储登录表单数据
			loginForm: {
				username: '',
				password: ''
			},
			username: '' // 定义一个响应式数据
		}
	},
	methods: {
		// 登录表单提交
		onSubmit(event) {
			// 获取表单数据
			this.loginForm.username = event.detail.value.username
			this.loginForm.password = event.detail.value.password

			// 发起登录请求
			uni.request({
				url: 'http://localhost:5000/login', // 后端登录接口地址
				method: 'POST',
				data: this.loginForm,
				success: (res) => {
					if (res.statusCode === 200) {
						// 登录成功
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						// 登录成功后
						uni.setStorageSync('username', this.loginForm.username);
						console.log("存储的用户名:", this.loginForm.username); // 打印存储的用户名
						    // 确认用户名是否被正确存储
						console.log("从本地存储读取的用户名:", this.loginForm.username); // 打印从本地存储读取的用户名
						  // 确认用户名是否被正确存储
						uni.navigateTo({
							url:'/pages/index/index'
						})
						// 可以在这里跳转到其他页面
					} else {
						// 登录失败
						uni.showToast({
							title: '用户名或密码错误',
							icon: 'none'
						})
					}
				},
				fail: () => {
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					})
				}
			})
		},
		// 跳转到注册页面
		goToRegister() {
			console.log('goToRegister clicked');
			uni.navigateTo({
				url: '/pages/register/register', // 确保路径正确
				success: () => {
					console.log('跳转成功');
				},
				fail: (err) => {
					console.error('跳转失败', err);
					uni.showToast({
						title: '跳转失败',
						icon: 'none'
					});
				}
			});
		}
	}
}
</script>

<style lang="scss">
$primary-color: #1aad19;
$secondary-color: #6c757d;
$hover-color: #169c15;

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f9fc, #e9f2eb);
}

.login-wrapper {
  width: 90%;
  max-width: 400px;
  padding: 40rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.08);
  transform: translateY(-10%);
}

.login-header {
  text-align: center;
  padding: 40rpx 0;
  
  .title {
    display: block;
    font-size: 44rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 16rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: $secondary-color;
  }
}

.form-item {
  position: relative;
  margin-bottom: 40rpx;
}

.input {
  width: 100%;
  height: 96rpx;
  padding: 0 80rpx;
  font-size: 32rpx;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: $primary-color;
    box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.1);
  }
}

.input-icon {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
}

.placeholder-style {
  color: #adb5bd;
  font-size: 30rpx;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  font-size: 34rpx;
  font-weight: 500;
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 8%));
  color: #fff;
  border-radius: 48rpx;
  transition: all 0.3s ease;
  
  &-hover {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.action-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  font-size: 28rpx;
  
  .register-text {
    color: $secondary-color;
  }
  
  .register-link {
    color: $primary-color;
    margin: 0 16rpx;
    padding: 8rpx;
    transition: all 0.2s ease;
    
    &:active {
      opacity: 0.7;
    }
  }
  
  .divider {
    color: #dee2e6;
    margin: 0 16rpx;
  }
  
  .forgot-link {
    color: $secondary-color;
    padding: 8rpx;
    transition: all 0.2s ease;
    
    &:active {
      opacity: 0.7;
    }
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .container {
    background: linear-gradient(135deg, #2d3748, #1a202c);
  }
  
  .login-wrapper {
    background: #2d3748;
    box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.3);
  }
  
  .login-header {
    .title {
      color: #f8f9fa;
    }
    
    .subtitle {
      color: #a0aec0;
    }
  }
  
  .input {
    background: #4a5568;
    border-color: #4a5568;
    color: #f8f9fa;
    
    &:focus {
      border-color: $primary-color;
    }
  }
  
  .placeholder-style {
    color: #718096;
  }
  
  .action-links {
    .register-text {
      color: #a0aec0;
    }
    
    .forgot-link {
      color: #a0aec0;
    }
  }
}
</style>