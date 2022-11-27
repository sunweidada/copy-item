<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabToggle">
        <el-tab-pane label="用户管理" name="role">
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="isVisible = true">新增角色</el-button>
          </el-row>

          <!-- 列表区域 -->
          <el-table :data="roleList" border stripe>
            <el-table-column label="序号" type="index" width="80" />
            <el-table-column label="角色" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="290">
              <template v-slot="{ row }">
                <!-- 技巧：pre 标签可以将对象完整的展示 -->
                <!-- <pre>{{ row }}</pre> -->
                <el-button type="success" size="small" icon="el-icon-setting" @click="onAllotRole(row.id)">分配权限</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="onEditRole(row.id)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="onDelRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <!-- size-change 和 current-change事件
          来处理页码大小和当前页变动时候触发的事件 -->
          <!-- page-sizes 定义当前页面有多少个页数显示可以选择 -->
          <!-- page-size 表示每页显示多少条 -->
          <!-- total 表示总数 -->
          <!-- current-page 表示当前显示第几页 -->
          <el-pagination
            :current-page="pageInfo.page"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="company">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 公司里面，一般都会有人告诉你[ 微信，口述 ]，这个页面，哪个地方用哪个接口
          metho url 参数 -->
          <el-form label-width="120px">
            <el-form-item label="公司名称：">
              <el-input v-model="companyInfo.name" disabled />
            </el-form-item>
            <el-form-item label="公司地址：">
              <el-input v-model="companyInfo.companyAddress" disabled />
            </el-form-item>
            <el-form-item label="公司邮箱：">
              <el-input v-model="companyInfo.mailbox" disabled />
            </el-form-item>
            <el-form-item label="备注：">
              <el-input v-model="companyInfo.remarks" class="remark" type="textarea" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加角色弹框 -->
    <RoleDialog ref="roleDailogRef" :is-visible.sync="isVisible" @update-list="loadList" />

    <!-- 分配权限弹框 -->
    <AllotDialog ref="allotDialogRef" :is-show-allot.sync="isShowAllot" />
  </div>
</template>

<script>
import { getAllRoleList, getCompanyInfo, delRoleById } from '@/api/role'
import { mapGetters } from 'vuex'
import RoleDialog from './components/role-dialog.vue'
import AllotDialog from './components/allot-dialog.vue'

export default {
  name: 'SettingPage',
  components: {
    RoleDialog,
    AllotDialog
  },
  data() {
    return {
      activeName: 'role',
      // 参数：要给，但是那边是不需要分页的；麻烦了 -> 文档：角色 30
      pageInfo: {
        page: 1, // 当前显示第几页，默认第 1 页
        pagesize: 10 // 当前每页显示多少条，默认每页显示 2 条
      },
      total: 0,
      roleList: [],
      companyInfo: {},
      isVisible: false,
      isShowAllot: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const { rows, total } = await getAllRoleList(this.pageInfo)
      this.roleList = rows
      this.total = total
    },
    handleSizeChange(newSize) {
      // 更新 pagesize，重新拉取列表
      this.pageInfo.pagesize = newSize
      this.loadList()
    },
    handleCurrentChange(newPage) {
      // 更新 page，重新拉取列表
      this.pageInfo.page = newPage
      this.loadList()
    },
    async onEditRole(id) {
      // 编辑按钮 -> 要弹窗 要回显数据
      await this.$refs.roleDailogRef.getDetail(id)
      this.isVisible = true
    },
    onAllotRole(roleId) {
      // 分配权限
      this.isShowAllot = true

      // 要保证弹框组件已经生成到页面中了，再拿里面的方法
      this.$nextTick(async() => {
        await this.$refs.allotDialogRef.getRoleDetail(roleId)
      })
    },
    handleTabToggle() {
      if (this.activeName === 'company') {
        // 获取公司信息 !{} -> 需求
        if (!Object.keys(this.companyInfo).length) {
          this.loadCompanyInfo()
        }
      }
    },
    async loadCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    },
    async onDelRole(roleId) {
      // 删除角色的接口
      try {
        await this.$confirm('您确认要删除该角色吗？')
        await delRoleById(roleId)

        // 提示人家删除成功 列表要刷新
        this.$message.success('删除角色成功')

        // 考虑细节：当删除的列表只有一条数据的时候，重新刷新列表的时候需要将 page - 1

        if (this.roleList.length === 1) {
          this.pageInfo.page >= 2 ? this.pageInfo.page - 1 : this.pageInfo.page = 1
        }
        this.loadList()

        // 晚上，自行不要看视频，不要看文档（角色 - 添加 修改）
      } catch (error) {
        this.$message.info('您取消了删除')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}

.el-form {
  margin-top: 40px;
  .el-input, .remark {
    width: 500px;
  }
}
</style>
