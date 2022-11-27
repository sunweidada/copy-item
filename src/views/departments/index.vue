<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="depts-container">
        <tree-tools :tree-node="companyInfo" is-root @add-dept="onAddDept" />
        <hr>
        <!-- 使用 tree 组件 -->
        <!-- data属性：用来指定tree组件的数据源，一般是一个数组
        props：是配置信息列表：
          label	指定节点标签为节点对象的某个属性值（你看到的各级标题的文字，是通过 label 指定的）
          children 指定子树为节点对象的某个属性值（各个级别通过 children 去关联）
         -->
        <el-tree
          v-loading="isLoading"
          :data="departs"
          :props="defaultProps"
          default-expand-all
          node-key="id"
        >
          <!-- 使用作用域插槽，自定义tree节点的内容 -->
          <!-- 作用域插槽拿到的数据：node 表示节点的node对象 data 当前节点的数据 -->
          <template v-slot="{ data }">
            <tree-tools :tree-node="data" @delete-dept="onDelDept" @add-dept="onAddDept" @edit-dept="onEditDept" />
          </template>

          <!-- <tree-tools slot-scope="{ data }" :tree-node="data" /> -->
        </el-tree>
      </el-card>

      <!-- 添加部门的弹框 -->
      <dept-dialog ref="deptDailogRef" :is-show.sync="isShow" :dept-id="deptId" @update-list="updateList" />
    </div>
  </div>
</template>

<script>
import TreeTools from '@/components/TreeTools'
import { getDepartments, delDepartmentById } from '@/api/depts'
import { list2Tree } from '@/utils/index'
import DeptDialog from './components/dept-dialog.vue'

export default {
  name: 'DepartMent',
  components: {
    TreeTools,
    DeptDialog
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        // 就是通过 children 对应的属性名称去指定各个级别关联的属性
        children: 'children',
        label: 'name'
      },
      companyInfo: {
        name: '',
        manager: '负责人'
      },
      isShow: false,
      deptId: '',
      isLoading: true
    }
  },
  mounted() {
    this.loadDeptsList()
  },
  methods: {
    async loadDeptsList() {
      const res = await getDepartments()
      this.companyInfo.name = res.companyName
      // 转成树形结构(第二个参数是表示 一级部门的 pid 是啥)
      this.departs = list2Tree(res.depts, '')

      this.isLoading = false
    },
    async onDelDept(deptId) {
      // 警告提示框
      // const result = confirm('您确定要删除该部门吗？')
      try {
        const result = await this.$confirm('您确定要删除该部门吗？')
        if (result === 'confirm') {
          // 这里去执行删除部门的操作
          // 参数：就是你要删除的那个部门的 id
          await delDepartmentById(deptId)
          // 删除成功之后，要将列表刷新一遍
          this.loadDeptsList()
        }
      } catch (error) {
        // 是调用者请求的时候，自己捕捉的异常（错误消息）
        console.log('出错了', error)
      }
    },
    onAddDept(deptId) {
      this.deptId = deptId
      // 打开弹框
      this.isShow = true
    },
    async onEditDept(id) {
      this.deptId = id
      // 编辑 1、弹框  2、显示回来的信息
      // 获取部门详情的接口，在哪请求比较好 -> 在弹框组件里面请求
      await this.$refs.deptDailogRef.getDetail(id)

      // 判断当前状态是添加？还是修改呢？可以根据表单对象里面的 id 属性

      this.isShow = true
    },
    updateList() {
      // this.isShow = false
      this.loadDeptsList()
    }
  }
}
</script>

<style lang="scss" scoped>
.depts-container {
  padding: 30px 50px;
  .manage-text {
    margin-right: 20px;
    font-size: 16px;
  }

  .el-dropdown {
    color: #333;
    font-size: 16px !important;
  }

  .tree-item {
    width: 100%;
  }
}
</style>
