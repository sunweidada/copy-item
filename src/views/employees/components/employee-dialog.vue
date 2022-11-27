<template>
  <el-dialog title="添加员工" :visible="isVisible" width="35%" @close="onClose">
    <el-form ref="employeeFormRef" :model="employeeForm" :rules="employeeFormRules" label-width="100px">
      <el-form-item label="姓名：" prop="username">
        <el-input v-model="employeeForm.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="employeeForm.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间：" prop="timeOfEntry">
        <!-- 日期选择器 -->
        <el-date-picker v-model="employeeForm.timeOfEntry" type="date" placeholder="请选择入职日期" />
      </el-form-item>
      <el-form-item label="聘用形式：" prop="formOfEmployment">
        <el-select v-model="employeeForm.formOfEmployment">
          <el-option v-for="hire in hirType" :key="hire.id" :label="hire.value" :value="hire.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号：" prop="workNumber">
        <el-input v-model="employeeForm.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门：" prop="departmentName">
        <el-cascader
          v-model="deptNames"
          placeholder="请选择部门"
          :options="depts"
          :props="{ label: 'name', value: 'name', checkStrictly: true }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="转正时间：" prop="correctionTime">
        <el-date-picker v-model="employeeForm.correctionTime" type="date" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="info" size="small" @click="onClose">取消</el-button>
      <el-button type="primary" size="small" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import HireType from '@/api/constant/employees'
import { getDepartments } from '@/api/depts'
import { list2Tree } from '@/utils/index'
import { addEmployee } from '@/api/employee'

export default {
  name: 'EmployeeDialog',
  // 通过 model 属性，可以将默认的 value 和 input 进行更改
  model: {
    prop: 'isVisible',
    event: 'update-visible'
  },
  props: {
    // v-model 自定义组件传值：value input
    // value: {
    //   type: Boolean,
    //   default: false
    // }
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hirType: HireType.hireType,
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      depts: [], // 部门信息
      deptNames: [],
      employeeFormRules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 2, max: 5, message: '用户名称应该在2-5个字符之间', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          // pattern 正则的形式去判断手机号是否符合手机号的规则（11）
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.loadDepts()
  },
  methods: {
    async loadDepts() {
      const res = await getDepartments()
      // 依然需要将 列表 结构转成 树形结构
      this.depts = list2Tree(res.depts, '')
    },
    onClose() {
      // 手动将 部门进行置空
      this.deptNames = []
      // 关闭弹框
      // this.$emit('input', false)
      this.$emit('update-visible', false)
      // 移除校验结果
      this.$refs.employeeFormRef.resetFields()
    },
    handleChange(value) {
      // 给部门名称赋值
      this.employeeForm.departmentName = value[value.length - 1]
    },
    async confirm() {
      // 执行添加员工的操作
      try {
        await this.$refs.employeeFormRef.validate()
        await addEmployee(this.employeeForm)
        this.$message.success('添加员工成功')
        this.onClose()
        // 主页面列表也要刷新
        this.$emit('update-list')
      } catch (error) {
        console.log('校验不通过')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-date-editor.el-input, .el-select, .el-cascader {
    width: 100%;
  }
}
</style>
