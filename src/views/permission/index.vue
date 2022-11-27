
<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-row>
          <!-- 要区分是新建一级还是二级 -->
          <el-button size="small" type="primary" @click="onAddPerm(1, '0')">添加权限</el-button>
        </el-row>
      </el-card>
      <el-card class="table-content">
        <!-- 表格区域 -->
        <!-- 需要添加 row-key属性表示每一行都是唯一的：加完之后可以将有子节点的展开 -->
        <!-- default-expand-all 默认展开所有行 -->
        <el-table :data="permissionList" border stripe row-key="id" default-expand-all>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" align="center" />
          <el-table-column label="描述" prop="description" align="center" />
          <el-table-column label="操作" width="280" align="center">
            <!-- 由于需求的限制，我们是没有添加到第三极的，所以添加按钮只在一级存在 -->
            <template v-slot="{ row }">
              <el-button v-if="row.type === 1" size="mini" type="primary" icon="el-icon-plus" @click="onAddPerm(2, row.id)">添加</el-button>
              <el-button size="mini" type="success" icon="el-icon-edit" @click="onEdit(row.id)">修改</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="onDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <PermDialog :id="id" ref="PermDialogRef" :is-visible.sync="isVisible" :type="type" @update-list="updateList" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permission'
import { list2Tree } from '@/utils'
import PermDialog from './components/perm-dialog.vue'

// 项目实战，但凡有 弹框，全部要求放到一个组件里面

export default {
  name: 'PermissionPage',
  components: {
    PermDialog
  },
  data() {
    return {
      permissionList: [],
      isVisible: false,
      type: 1,
      id: ''
    }
  },
  mounted() {
    this.loadList()
  },
  methods: {
    async loadList() {
      const list = await getPermissionList()
      this.permissionList = list2Tree(list, '0')
    },
    onAddPerm(type, id) {
      this.type = type
      this.id = id
      this.isVisible = true
    },
    updateList() {
      this.loadList()
      this.type = 1
      this.id = ''
    },
    async onDel(id) {
      const res = confirm('您确定要删除该权限吗？')
      if (res) {
        try {
          await delPermission(id)
          this.loadList()
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error('删除失败')
        }
      }
    },
    async onEdit(id) {
      // 需要请求详情
      await this.$refs.PermDialogRef.getDetail(id)
      // 需要弹框
      this.isVisible = true
    }
  }
}
// echarts 都是配置（属性很多）
// react 面试的很多都在问（vue react -> 最新的 hooks）
</script>

<style lang="scss" scoped>
.table-content {
  margin-top: 10px;
}
</style>
