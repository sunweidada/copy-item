<template>
  <el-card>
    <el-row type="flex" align="middle">
      <!-- 1、左侧长什么样子，由使用者决定
      2、有的页面需要显示，有的不需要显示 -->
      <el-col v-if="isShowLeft" :span="12">
        <i class="el-icon-info" />
        <slot name="left" />
      </el-col>
      <el-col :span="!isShowLeft ? 24 : 12">
        <el-row type="flex" justify="end">
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    isShowLeft: {
      type: Boolean,
      default: false // 默认不显示左侧区域
    }
  }
}
</script>

<style>

</style>
