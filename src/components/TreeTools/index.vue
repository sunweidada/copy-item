<template>
  <el-row class="tree-item">
    <el-col :span="12">
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="12">
      <el-row type="flex" justify="end">
        <span class="manage-text">{{ treeNode.manager }}</span>
        <!-- 下拉菜单 -->
        <!-- command 翻译成 指令 -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
            <el-dropdown-item v-if="!isRoot" command="delete">删除子部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TreeTools',
  props: {
    treeNode: {
      // 当前节点数据（部门名称和负责人信息）
      type: Object,
      default: () => {}
    },
    isRoot: {
      type: Boolean,
      default: false // 表示当前这个节点是不是根节点
    }
  },
  methods: {
    handleCommand(command) {
      // 三种情况（我们不建议将逻辑写到组件里面
      // -> 通过 自定义事件通知父组件执行添加，修改，删除）
      // switch (command) {
      //   case 'add':
      //     // 触发自定义事件，通知父组件打开弹框
      //     this.$emit('add-dept', this.treeNode.id)
      //     break
      //   case 'edit':
      //     this.$emit('edit-dept', this.treeNode.id)
      //     break
      //   case 'delete':
      //     this.$emit('delete-dept', this.treeNode.id)
      //     break
      // }
      this.$emit(`${command}-dept`, this.treeNode.id)
    }
  }
}
</script>

<style scoped lang="scss">
.tree-item {
  width: 100%;
}

.manage-text {
  margin-right: 10px;
}
</style>
