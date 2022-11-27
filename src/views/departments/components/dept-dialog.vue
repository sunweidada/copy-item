<template>
  <el-dialog :title="`${title}子部门`" :visible="isShow" width="30%" :before-close="onClose">
    <!-- 添加部门的表单 -->
    <el-form ref="deptFormRef" :model="deptForm" :rules="deptFormRules" label-width="110px">
      <el-form-item label="部门名称：" prop="name">
        <el-input v-model="deptForm.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码：" prop="code">
        <el-input v-model="deptForm.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人：" prop="manager">
        <el-select v-model="deptForm.manager" placeholder="请选择部门负责人" @focus="onFocus">
          <!-- el-option 可选项 -->
          <!-- label 指定的属性是给用户看到 -->
          <!-- value 是用户选中这个 option 之后，会自动将 value 所绑定的值给 deptForm.manager 同步 -->

          <!-- 这里的可选项应该是由接口提供的 -->
          <el-option v-for="simple in simpleList" :key="simple.id" :label="simple.username" :value="simple.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍：" prop="introduce">
        <el-input v-model="deptForm.introduce" type="textarea" placeholder="请输入部门名称" />
      </el-form-item>
    </el-form>
    <!-- 定义弹框底部的button -->
    <!-- <template slot="footer"> -->
    <!-- <template v-slot:footer> -->
    <template #footer>
      <el-button type="info" size="small" @click="onClose">取消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getSimpleList, getDepartments, addDepartment, getDeptDetailById, editDepartment } from '@/api/depts'

export default {
  // 应该要使用者给我一个属性，控制弹框的显示和隐藏
  props: {
    isShow: Boolean,
    deptId: {
      type: [String, Number],
      default: '' // 默认值生效（有用了）
    }
  },
  data() {
    const checkDeptName = async(rule, value, cb) => {
      // 需求：同级部门中禁止出现重复部门
      const { depts } = await getDepartments()
      // 拿着 depts 去找（根据 this.deptId 去找所有的子部门 -> 里面的名称应该不能和 value 重名）
      // value 不能和同级别的一致（推导出：两个部门的 pid 是一致的）
      // this.deptId
      // 找同事
      let isRepeat
      // 添加和修改验证部门名称的规则不一致
      if (this.deptForm.id) {
        // 修改的校验(需要剔除自己)
        // console.log(depts.filter.(dept => this.deptForm.pid === dept.pid && this.deptForm.id !== dept.id)).some(item => item.name === value)
        // debugger
        isRepeat = depts.filter(dept => this.deptForm.pid === dept.pid && this.deptForm.id !== dept.id)
          .some(item => item.name === value)
      } else {
        // 添加的校验
        isRepeat = depts.filter(dept => this.deptId === dept.pid).some(item => item.name === value)
      }
      isRepeat ? cb(new Error(`同级部门下已经存在${value}名称了`)) : cb()
    }

    const checkDeptCode = async(rule, value, cb) => {
      // 需求：部门编码在整个模块中都不允许重复
      const { depts } = await getDepartments()
      // some 是判断只要有一个元素符合条件就返回 true
      // every 是判断必须所有元素都符合条件才返回 true
      let isRepeat

      if (this.deptForm.id) {
        // 修改编码的校验
        isRepeat = depts.filter(dept => dept.id !== this.deptForm.id).some(item => item.code === value)
      } else {
        isRepeat = depts.some(item => item.code === value)
      }

      isRepeat ? cb(new Error(`公司下已经存在${value}编码了`)) : cb()
    }

    return {
      deptForm: {
        name: '',
        code: '',
        manager: '',
        introduce: '', // pid
        pid: ''
      },
      simpleList: [],
      deptFormRules: {
        name: [
          {
            required: true, message: '部门名称不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 6, message: '部门名称应该在3-6个字符串之间', trigger: 'blur'
          },
          // 添加部门名称的自定义校验规则
          {
            validator: checkDeptName, trigger: 'blur'
          }
        ],
        code: [
          {
            required: true, message: '部门编码不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 6, message: '部门名编码应该在3-6个字符串之间', trigger: 'blur'
          },

          {
            validator: checkDeptCode, trigger: 'blur'
          }],
        manager: [
          {
            required: true, message: '部门负责人不能为空', trigger: 'blur'
          }],
        introduce: [
          {
            required: true, message: '部门介绍不能为空', trigger: 'blur'
          },

          {
            min: 1, max: 100, message: '部门名称应该在1-100个字符串之间', trigger: 'blur'
          }]
      }
    }
  },
  computed: {
    title() {
      return this.deptForm.id ? '编辑' : '添加'
    }
  },
  methods: {
    async onFocus() {
      // 去加载员工简单列表
      this.simpleList = await getSimpleList()
    },
    async onConfirm() {
      // 执行添加部门逻辑
      try {
        // 这里需要区分，当前是什么状态：添加？修改？
        if (this.deptForm.id) {
          // 修改
          await this.$refs.deptFormRef.validate()
          await editDepartment(this.deptForm)
        } else {
          // 添加
          await this.$refs.deptFormRef.validate()
          this.deptForm.pid = this.deptId
          await addDepartment(this.deptForm)
        }
        this.$message.success(`部门${this.deptForm.id ? '编辑' : '新增'}成功`)
        this.onClose()
        this.$emit('update-list')
      } catch (error) {
        console.log('验证不通过')
      }
    },
    async getDetail(id) { // id -> 部门id
      this.deptForm = await getDeptDetailById(id)
    },
    // :before-close不会自动调用关闭弹可的close 方法
    // @closed会自动调用关闭弹框的close方法
    onClose() {
      console.log('onClose')
      // 需要自己手动去把form对象置空
      this.deptForm = {
        name: '',
        code: '',
        manager: '',
        introduce: '', // pid
        pid: ''
      }
      // 移除校验结果 -> resetFields 只能移除表单对象身上已经绑定了的属性
      this.$refs.deptFormRef.resetFields()
      // 关闭弹框
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
    .el-select {
        width: 100%;
    }
}
</style>
