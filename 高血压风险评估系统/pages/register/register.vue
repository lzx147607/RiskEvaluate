<template>
	<view class="container">
	  <view class="register-wrapper">
	    <view class="register-header">
	      <text class="title">创建账户</text>
	      <text class="subtitle">开启您的健康管理之旅</text>
	    </view>
	    
	    <view class="register-form">
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
	        
	        <view class="form-item">
	          <input 
	            class="input" 
	            name="confirmPassword" 
	            type="password" 
	            placeholder="确认密码"
	            placeholder-class="placeholder-style"
	          />
	          <uni-icons class="input-icon" type="refresh" size="20" color="#999" />
	        </view>
	        
	        <button 
	          form-type="submit" 
	          class="submit-btn"
	          hover-class="submit-btn-hover"
	        >
	          立即注册
	        </button>
	        
	        <view class="action-links">
	          <text class="login-text">已有账户？</text>
	          <text class="login-link" @click="goToLogin">立即登录</text>
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
			// 用于存储注册表单数据
			registerForm: {
				username: '',
				password: '',
				confirmPassword: ''
			}
		}
	},
	methods: {
		// 注册表单提交
		onSubmit(event) {
			// 获取表单数据
			this.registerForm.username = event.detail.value.username
			this.registerForm.password = event.detail.value.password
			this.registerForm.confirmPassword = event.detail.value.confirmPassword

			// 验证密码是否一致
			if (this.registerForm.password !== this.registerForm.confirmPassword) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				})
				return
			}

			// 发起注册请求
			uni.request({
				url: 'http://localhost:5000/register', // 后端注册接口地址
				method: 'POST',
				data: {
					username: this.registerForm.username,
					password: this.registerForm.password
				},
				success: (res) => {
					if (res.statusCode === 201) {
						// 注册成功
						uni.showToast({
							title: '注册成功',
							icon: 'success'
						})
						// 可以在这里跳转到登录页面
						this.goToLogin()
					} else {
						// 注册失败
						uni.showToast({
							title: res.data.message || '注册失败',
							icon: 'none'
						})
					}
				},
				fail: () => {
					uni.showToast({
						title: '注册失败',
						icon: 'none'
					})
				}
			})
		},
		// 跳转到登录页面
		goToLogin() {
			uni.navigateTo({
				url: '/pages/login/login', // 确保路径正确
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

.register-wrapper {
  width: 90%;
  max-width: 400px;
  padding: 40rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.08);
  transform: translateY(-10%);
}

.register-header {
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
  margin-top: 40rpx;
  
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
  
  .login-text {
    color: $secondary-color;
  }
  
  .login-link {
    color: $primary-color;
    margin-left: 16rpx;
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
  
  .register-wrapper {
    background: #2d3748;
    box-shadow: 0 12rpx 24rpx rgba(0,0,0,0.3);
  }
  
  .register-header {
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
}
</style>