<template>
  <!-- 新建一级的时候：type 为 1, 新建二级的时候 type 为 2 -->
  <!-- 新建一级的时候: pid 为 "0", 新建二级的时候 pid 为 一级的 id -->
  <el-dialog :title="title" width="30%" :visible="isVisible" @close="onClose">
    <el-form ref="permFormRef" :model="permForm" :rules="permFormRules" label-width="110px">
      <el-form-item label="权限名称：" prop="name">
        <el-input v-model="permForm.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限标识：" prop="code">
        <el-input v-model="permForm.code" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="权限描述：">
        <el-input v-model="permForm.description" placeholder="请输入权限描述" />
      </el-form-item>
      <el-form-item label="权限是否开启：">
        <!-- 不是猜的，是观察到的，开启的时候给 '1'  关闭的时候给 '0' -->
        <el-switch v-model="permForm.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-row type="flex" justify="center">
        <el-button type="info" size="small" @click="onClose">取消</el-button>
        <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addPermission, getPermissionDetail, updatePermission } from '@/api/permission'

export default {
  name: 'PermDialog',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      permForm: {
        enVisible: '',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      permFormRules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.permForm.id ? '编辑权限' : '新增权限'
    }
  },
  methods: {
    onClose() {
      // 移除校验规则
      this.$refs.permFormRef.resetFields() // name code
      this.permForm = {
        enVisible: '',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
      this.$emit('update:isVisible', false)
    },
    async onConfirm() {
      try {
        await this.$refs.permFormRef.validate()

        if (this.permForm.id) {
          // 编辑
          await updatePermission(this.permForm)
          this.$message.success('修改权限成功')
        } else {
          const inputParmas = {
            ...this.permForm,
            ...{ pid: this.id, type: this.type }
          }
          // this.permForm.pid = this.id
          // this.permForm.type = this.type
          // 可以执行添加逻辑
          await addPermission(inputParmas)
          this.$message.success('添加权限成功')
        }
        // 关窗
        this.onClose()
        // 通知父组件刷新列表
        // 重置接收过来的 type id
        this.$emit('update-list')
      } catch (error) {
        // error 为 false 表示校验未通过
        // error 为 对象的话，表示是请求有误
        // console.dir(error)
        // this.$message.warning('校验未通过，请检查')
        if (!error) {
          this.$message.warning('校验未通过，请检查')
        }
      }
    },
    async getDetail(id) {
      this.permForm = await getPermissionDetail(id)
    }
  }
}
</script>

<style>

</style>
