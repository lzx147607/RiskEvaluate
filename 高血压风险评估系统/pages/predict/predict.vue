<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">高血压风险预测</text>
      <text class="subtitle">请填写您的健康信息</text>
    </view>

    <!-- 表单主体 -->
    <view class="form-card">
      <scroll-view scroll-y class="form-scroll">
        <form @submit="submitForm">
          <!-- 年龄 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">年龄</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 18-100岁</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.age"
              placeholder="请输入年龄"
              @input="validateField('age', $event)"
              :style="{borderColor: errors.age ? errorColor : borderColor}"
            />
            <view v-if="errors.age" class="error-msg">
              <text class="error-text">{{ errors.age }}</text>
            </view>
          </view>

          <!-- 性别 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">性别</text>
            </view>
            <radio-group 
              class="radio-group" 
              name="male"
              @change="handleRadioChange('male', $event)"
            >
              <label
                  class="radio-item" 
                  v-for="(option, index) in options.genders" 
                  :key="index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="formData.male === option.value"
                    :color="primaryColor" 
                  />
                  <text class="radio-text">{{ option.label }}</text>
                </label>
            </radio-group>
          </view>

          <!-- 是否吸烟 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">是否吸烟</text>
            </view>
            <radio-group 
              class="radio-group" 
              name="currentSmoker"
              @change="handleRadioChange('currentSmoker', $event)"
            >
              <label
                  class="radio-item" 
                  v-for="(option, index) in options.smokers" 
                  :key="index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="formData.currentSmoker === option.value"
                    :color="primaryColor" 
                  />
                  <text class="radio-text">{{ option.label }}</text>
                </label>
            </radio-group>
          </view>

          <!-- 每日吸烟量（条件显示） -->
          <view class="form-group" v-if="formData.currentSmoker === '1'">
            <view class="label-group">
              <text class="label">每日吸烟量</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 0-100支/天</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.cigsPerDay"
              placeholder="请输入每日吸烟量"
              @input="validateField('cigsPerDay', $event)"
              :style="{borderColor: errors.cigsPerDay ? errorColor : borderColor}"
            />
            <view v-if="errors.cigsPerDay" class="error-msg">
              <text class="error-text">{{ errors.cigsPerDay }}</text>
            </view>
          </view>

          <!-- 是否服用降压药 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">服用降压药</text>
            </view>
            <radio-group 
              class="radio-group" 
              name="BPMeds"
              @change="handleRadioChange('BPMeds', $event)"
            >
              <label 
                  class="radio-item" 
                  v-for="(option, index) in options.medsOptions" 
                  :key="index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="formData.BPMeds === option.value"
                    :color="primaryColor" 
                  />
                  <text class="radio-text">{{ option.label }}</text>
                </label>
            </radio-group>
          </view>

          <!-- 是否患有糖尿病 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">糖尿病</text>
            </view>
            <radio-group 
              class="radio-group" 
              name="diabetes"
              @change="handleRadioChange('diabetes', $event)"
            >
              <label 
                  class="radio-item" 
                  v-for="(option, index) in options.diabetesOptions" 
                  :key="index"
                >
                  <radio 
                    :value="option.value" 
                    :checked="formData.diabetes === option.value"
                    :color="primaryColor" 
                  />
                  <text class="radio-text">{{ option.label }}</text>
                </label>
            </radio-group>
          </view>

          <!-- 总胆固醇 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">胆固醇</text>
              <view class="range-hint">
                <text class="range-text">建议范围:100-240 mg/dL</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.totChol"
              placeholder="请输入总胆固醇值"
              @input="validateField('totChol', $event)"
              :style="{borderColor: errors.totChol ? errorColor : borderColor}"
            />
            <view v-if="errors.totChol" class="error-msg">
              <text class="error-text">{{ errors.totChol }}</text>
            </view>
          </view>

          <!-- 收缩压 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">收缩压</text>
              <view class="range-hint">
                <text class="range-text">建议范围:90-120mmHg</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.sysBP"
              placeholder="请输入收缩压值"
              @input="validateField('sysBP', $event)"
              :style="{borderColor: errors.sysBP ? errorColor : borderColor}"
            />
            <view v-if="errors.sysBP" class="error-msg">
              <text class="error-text">{{ errors.sysBP }}</text>
            </view>
          </view>

          <!-- 舒张压 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">舒张压</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 60-80 mmHg</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.diaBP"
              placeholder="请输入舒张压值"
              @input="validateField('diaBP', $event)"
              :style="{borderColor: errors.diaBP ? errorColor : borderColor}"
            />
            <view v-if="errors.diaBP" class="error-msg">
              <text class="error-text">{{ errors.diaBP }}</text>
            </view>
          </view>

          <!-- BMI -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">BMI</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 18.5-24.9</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.BMI"
              placeholder="请输入BMI值"
              @input="validateField('BMI', $event)"
              :style="{borderColor: errors.BMI ? errorColor : borderColor}"
            />
            <view v-if="errors.BMI" class="error-msg">
              <text class="error-text">{{ errors.BMI }}</text>
            </view>
          </view>

          <!-- 心率 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">心率</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 60-100 次/分钟</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.heartRate"
              placeholder="请输入心率值"
              @input="validateField('heartRate', $event)"
              :style="{borderColor: errors.heartRate ? errorColor : borderColor}"
            />
            <view v-if="errors.heartRate" class="error-msg">
              <text class="error-text">{{ errors.heartRate }}</text>
            </view>
          </view>

          <!-- 血糖 -->
          <view class="form-group">
            <view class="label-group">
              <text class="label">血糖</text>
              <view class="range-hint">
                <text class="range-text">建议范围: 70-100 mg/dL</text>
              </view>
            </view>
            <input 
              class="input-box"
              type="number"
              v-model="formData.glucose"
              placeholder="请输入血糖值"
              @input="validateField('glucose', $event)"
              :style="{borderColor: errors.glucose ? errorColor : borderColor}"
            />
            <view v-if="errors.glucose" class="error-msg">
              <text class="error-text">{{ errors.glucose }}</text>
            </view>
          </view>

          <!-- 提交按钮 -->
          <button 
            class="submit-btn" 
            form-type="submit"
            hover-class="btn-hover"
            :loading="submitting"
            :disabled="hasErrors || submitting"
          >
            <text v-if="!submitting">立即评估风险</text>
            <text v-else>分析中...</text>
          </button>
        </form>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      primaryColor: '#1aad19',
      errorColor: '#FF9800', // 改为橙色
      borderColor: '#e0e0e0',
      submitting: false,
      errors: {},
      formData: {
        username: '',
        age: null,
        male: null,
        currentSmoker: null,
        cigsPerDay: null,
        BPMeds: null,
        diabetes: null,
        totChol: null,
        sysBP: null,
        diaBP: null,
        BMI: null,
        heartRate: null,
        glucose: null
      },
      options: {
              // 确保所有选项正确定义
              genders: [
                { label: '男性', value: '1' },
                { label: '女性', value: '0' }
              ],
              smokers: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              medsOptions: [
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ],
              diabetesOptions: [ // 添加缺失的选项配置
                { label: '是', value: '1' },
                { label: '否', value: '0' }
              ]
            }
    }
  },
  computed: {
    hasErrors() {
      return Object.values(this.formData).some(v => 
        v === null || v === '' || (typeof v === 'number' && isNaN(v))
      )
    }
  },
  mounted() {
    this.formData.username = uni.getStorageSync('username') || 'default_user'
  },
  methods: {
    handleRadioChange(field, e) {
      this.formData[field] = e.detail.value
      this.errors[field] = ''
      // 处理吸烟量显示
      if (field === 'currentSmoker' && e.detail.value === '0') {
        this.formData.cigsPerDay = 0
      }
    },

    validateField(field, e) {
      const value = e.detail.value
      this.formData[field] = value ? Number(value) : null
      this.errors[field] = ''

      // 宽松验证逻辑
      if (value === '' || value === null) {
        this.errors[field] = '此项为必填项'
        return
      }

      // 建议性提示（不影响提交）
      const validationRules = {
        age: { min: 18, max: 100, label: '年龄', unit: '岁' },
        cigsPerDay: { min: 0, max: 100, label: '吸烟量', unit: '支/天' },
        totChol: { min: 100, max: 240, label: '总胆固醇', unit: 'mg/dL' },
        sysBP: { min: 90, max: 120, label: '收缩压', unit: 'mmHg' },
        diaBP: { min: 60, max: 80, label: '舒张压', unit: 'mmHg' },
        BMI: { min: 18.5, max: 24.9, label: 'BMI', unit: '' },
        heartRate: { min: 60, max: 100, label: '心率', unit: '次/分钟' },
        glucose: { min: 70, max: 100, label: '血糖', unit: 'mg/dL' }
      }

      const rule = validationRules[field]
      if (!rule) return

      const numValue = Number(value)
      if (numValue < rule.min) {
        this.errors[field] = `${rule.label}低于建议值（${rule.min}${rule.unit}），建议咨询医生`
      } else if (numValue > rule.max) {
        this.errors[field] = `${rule.label}高于建议值（${rule.max}${rule.unit}），建议复查确认`
      }
    },

    async submitForm() {
      if (this.hasErrors) {
        uni.showToast({ title: '请填写所有必填项', icon: 'none' })
        return
      }

      this.submitting = true
      try {
        const res = await uni.request({
          url: 'http://localhost:5000/predict',
          method: 'POST',
          data: {
            ...this.formData,
            male: Number(this.formData.male),
            currentSmoker: Number(this.formData.currentSmoker),
            BPMeds: Number(this.formData.BPMeds),
            diabetes: Number(this.formData.diabetes)
          }
        })
        
        if (res.statusCode === 200) {
          uni.navigateTo({
            url: `/pages/result/result?risk=${res.data.risk}&healthData=${encodeURIComponent(JSON.stringify(this.formData))}`
          })
        } else {
          uni.showToast({ title: res.data.message || '预测失败', icon: 'none' })
        }
      } catch (error) {
        uni.showToast({ title: '请求失败，请检查网络', icon: 'none' })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss">
$primary-color: #1aad19;
$error-color: #FF9800;
$text-color: #2c3e50;

.container {
  padding: 20rpx;
  background: #f8f9fa;
  min-height: 100vh;
  width: 100vw; // 视口宽度
}

.header {
  text-align: center;
  padding: 40rpx 0;
  .title {
    font-size: 44rpx;
    font-weight: 600;
    color: $text-color;
    margin-bottom: 10rpx;
  }
  .subtitle {
    color: #666;
    font-size: 28rpx;
  }
}

.form-card {
  background: white;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
  // margin: 20rpx;
  overflow: hidden;
  
  .form-scroll {
    padding: 32rpx;
    max-height: 70vh;
  }
}

.form-group {
  margin-bottom: 40rpx;
  .label-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .label {
      font-size: 32rpx;
      color: $text-color;
      font-weight: 500;
    }
    
    .range-hint {
      .range-text {
        color: #666;
        font-size: 24rpx;
      }
    }
  }
}

.input-box {
  width: 100%;
  height: 96rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 28rpx;
  transition: all 0.3s;
  
  &:focus {
    border-color: $primary-color;
    box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.1);
  }
}

.radio-group {
  display: flex;
  gap: 40rpx;
  .radio-item {
    display: flex;
    align-items: center;
    .radio-text {
      margin-left: 12rpx;
      font-size: 28rpx;
    }
  }
}

.error-msg {
  margin-top: 16rpx;
  .error-text {
    color: $error-color;
    font-size: 24rpx;
  }
}

.submit-btn {
  background: linear-gradient(135deg, $primary-color, darken($primary-color, 10%));
  color: white;
  height: 96rpx;
  border-radius: 48rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
  transition: all 0.3s;
  
  &[disabled] {
    opacity: 0.6;
    filter: grayscale(0.5);
  }
  
  &.btn-hover {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style>