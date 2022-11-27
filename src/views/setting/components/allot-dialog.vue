<template>
  <el-dialog title="分配权限" width="30%" :visible="isShowAllot" @close="onClosed">
    <!-- data 属性指定数据源 -->
    <!-- chow-checkbx 属性设置复选框选项 -->
    <!-- node-key 在整棵树中是唯一的  -->
    <!-- default-expanded-keys 设置默认展开的节点的 id 的集合 -->
    <!-- default-checked-keys 设置默认的勾选的节点的 id 的集合 -->
    <!-- props 设置树形控件显示的数据选项 -->
    <!-- check-strictly 设置父子节点不相互关联 -->
    <el-tree
      ref="treeRef"
      :data="permList"
      show-checkbox
      node-key="id"
      :check-strictly="true"
      default-expand-all
      :props="defaultProps"
    />

    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button type="info" size="small" @click="onClosed">取消</el-button>
        <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { list2Tree } from '@/utils'
import { getRoleDetailById, allotPerm } from '@/api/role'

export default {
  name: 'AllotDialog',
  props: {
    isShowAllot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permList: [],
      defaultProps: {
        // 关联上下级的属性
        children: 'children',
        // 显示什么文本给用户看
        label: 'name'
      },
      roleId: ''
    }
  },
  mounted() {
    this.loadPermList()
  },
  methods: {
    async loadPermList() {
      const res = await getPermissionList()
      this.permList = list2Tree(res, '0')
    },
    onClosed() {
      this.roleId = ''
      this.$emit('update:isShowAllot', false)
    },
    async getRoleDetail(id) {
      this.roleId = id

      const { permIds } = await getRoleDetailById(id)
      // permIds 是这个角色本身拥有的权限
      //   console.log(res)
      //   this.defaultCheckdKeys = permIds
      this.$refs.treeRef.setCheckedKeys(permIds)
    },
    async onConfirm() {
      const inputParams = {
        id: this.roleId,
        permIds: this.$refs.treeRef.getCheckedKeys()
      }
      try {
        await allotPerm(inputParams)
        this.$message.success('分配权限成功')
        this.onClosed()
      } catch (error) {
        this.$message.error('给角色分配权限出错了')
      }
    }
  }
}
</script>

<style>

</style>
