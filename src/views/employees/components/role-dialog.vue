<template>
  <el-dialog title="添加角色" width="40%" :visible="isShow" @close="onClose">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds" v-loading="isLoading">
      <!-- el-checkbox 是通过 label 属性去收集数据的 -->

      <!-- 给默认值的时候，是需要给 roleIds 做赋值 -->
      <el-checkbox v-for="role of roleList" :key="role.id" :label="role.id">
        {{ role.name }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 取消/确定按钮 -->
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button size="small" type="info" @click="onClose">取消</el-button>
        <el-button size="small" type="primary" @click="onConfirm">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getAllRoleList } from '@/api/role'
import { getUserDetailById } from '@/api/user'
import { allotRole } from '@/api/employee'

export default {
  name: 'RoleDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      pageInfo: {
        page: 1, // 当前显示第几页，默认第 1 页
        pagesize: 20 // 当前每页显示多少条，默认每页显示 2 条（假使我们角色不会超过20种）
      },
      roleList: [],
      isLoading: true,
      id: ''
    }
  },
  beforeCreate() {
    console.log('子beforeCreate')
  },
  mounted() {
    console.log('子mounted')
    this.loadAllRoleList()
  },
  methods: {
    async loadAllRoleList() {
      const { rows } = await getAllRoleList(this.pageInfo)
      this.roleList = rows
      // 结束加载动画
      this.isLoading = false
    },
    onClose() {
      this.$emit('update:isShow', false)
    },
    // 获取员工本身具有的角色
    async getLocalRole(id) {
      this.id = id
      const res = await getUserDetailById(id)
      // this.roleIds = res.roleIds || []
      // 兼容接口返回的 roleIds 属性为 null 的情况
      this.roleIds = res?.roleIds ?? []
    },
    async onConfirm() {
      try {
        await allotRole({
          id: this.id,
          roleIds: this.roleIds
        })
        this.$message.success('分配角色成功')
        this.onClose()
      } catch (error) {
        this.$message.error('分配角色出错了')
      }
    }
  }
}
</script>

<style>

</style>
