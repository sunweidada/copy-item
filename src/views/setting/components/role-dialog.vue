<template>
  <el-dialog :title="`${getTitle()}角色`" width="40%" :visible="isVisible" @close="onClosed">
    <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="110px">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="角色描述：">
        <el-input v-model="roleForm.description" placeholder="请输入角色" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button type="info" size="small" @click="onClosed">取消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addRole, getRoleDetailById, editRole } from '@/api/role'

export default {
  name: 'RoleDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      roleFormRules: {
        name: [
          {
            required: true, message: '角色名称不能为空', trigger: 'blur'
          },
          {
            min: 2, max: 10, message: '角色名称应该在 2 - 10 字符之间', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async onConfirm() {
      try {
        await this.$refs.roleFormRef.validate()
        if (this.roleForm.id) {
          // 编辑
          await editRole(this.roleForm)
        } else {
          // 添加
          await addRole(this.roleForm)
        }
        this.$message.success(`${this.roleForm.id ? '编辑' : '添加'}角色成功`)
        this.onClosed()
        this.$emit('update-list')
      } catch (error) {
        console.log('校验未通过')
      }
    },
    async getDetail(id) {
      this.roleForm = await getRoleDetailById(id)
    },
    getTitle() {
      return this.roleForm.id ? '编辑' : '添加'
    },
    onClosed() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 关窗
      this.$emit('update:is-visible', false)
      // 移除校验结果
      this.$refs.roleFormRef.resetFields()
    }
  }
}
</script>

<style>

</style>
