<template>
  <div class="dashboard-container">
    <div class="detail-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form ref="formDataRef" :model="formData" :rules="formDataRules" label-width="110px">
              <el-form-item label="用户名：" prop="username">
                <el-input v-model="formData.username" placeholder="请输入用户名" />
              </el-form-item>
              <!-- 经过服务器加密后的密文，也不需要做回显 -->
              <el-form-item label="密码：" prop="psd">
                <el-input v-model="formData.psd" placeholder="请输入密码" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="saveUserInfo">更新信息</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <UserInfo /> -->
            <component :is="UserInfo" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveEmployeeInfo } from '@/api/user'
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'

export default {
  name: 'EmployeeDetail',
  components: {
    UserInfo,
    JobInfo
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {},
      formDataRules: {
        username: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          }, {
            min: 2, max: 5, message: '用户名的长度应该是2-5个字符之间', trigger: 'blur'
          }],
        psd: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
          {
            min: 5, max: 15, message: '密码的长度应该是5-15个字符之间', trigger: 'blur'
          }
        ]
      },
      UserInfo,
      JobInfo
    }
  },
  mounted() {
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      // 获取数据
      this.formData = await getUserDetailById(this.userId)
    },
    async saveUserInfo() {
      try {
        await this.$refs.formDataRef.validate()
        // console.log(this.formData) // 数据对不对？
        // 我们需要将我们新密码放在属性叫：password 身上
        // 合并一下对象里面的属性
        const newObj = Object.assign({}, this.formData, { password: this.formData.psd })
        // console.log(newObj) // password 这个属性应该是收集到的最新的密码

        await saveEmployeeInfo(newObj)

        this.$message.success('修改成功')
        // 想加什么功能，你觉得什么功能合适，你可以自行添加
        // 需要清除输入框？
      } catch (error) {
        console.log('校验失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  .el-form {
    margin-top: 30px;
  }
  .el-input {
    width: 300px;
  }
}
</style>
