<!-- components/segmented-control.vue -->
<template>
  <view class="segmented-control">
    <view 
      v-for="(item, index) in values" 
      :key="index"
      class="segment"
      :class="{ active: current === index }"
      @click="$emit('clickItem', index)"
    >
      {{ item }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    values: Array,
    current: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>
.segmented-control {
  display: flex;
  border-radius: 8px;
  background: #f5f5f5;
}
.segment {
  flex: 1;
  padding: 8px 16px;
  text-align: center;
  transition: all 0.3s;
}
.active {
  background: #007aff;
  color: white;
  border-radius: 6px;
}
</style>