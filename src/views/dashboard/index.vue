<template>
  <el-card>
    <image-upload />
    {{ a }}---{{ sum(2,5) }}
  </el-card>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
