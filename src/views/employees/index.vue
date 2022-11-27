<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部区域 -->

      <PageTools :is-show-left="true">
        <template #left>
          共{{ total }}条记录
        </template>
        <template #right>
          <!-- 导出功能，在公司里面，实现很简单，前端只需要调用一个接口，顶多再传递一个参数就好了 -->
          <!-- 当然，前端也可以实现导出数据到 excel 表格里面 -->
          <el-button size="small" type="danger" @click="export2Excel">excel导出</el-button>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="primary" @click="isVisible = true">新增员工</el-button>
        </template>
      </PageTools>

      <el-card class="box-card">
        <!-- 表格区域 -->
        <el-table :data="list" border stripe>
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="staffPhoto" width="111">
            <!-- 自定义这一栏长什么样子 -->
            <template v-slot="{ row }">
              <img v-imgerror="defaultImg" :src="row.staffPhoto || defaultImg" class="staff-img" @click="showQr(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" width="120" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="账户状态" prop="enableState">
            <template v-slot="{ row }">
              <!-- state 为 1 的时候，打开 -->
              <el-switch active-color="#67c23a" :value="row.enableState == 1" />
            </template>
          </el-table-column>

          <!-- 对列内容进行格式化：1、列的 formatter 属性 -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployee" /> -->
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="{ row }">
              {{ row.formOfEmployment | formatterHire }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <!-- 作用域插槽拿到当前行的数据 -->
            <!-- <template slot-scope="{ row }"> -->
            <template v-slot="{ row }">
              <el-button type="text" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="allotRole(row.id)">角色</el-button>
              <el-button type="text" @click="onDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          :current-page="pageInfo.page"
          :page-sizes="[10, 15, 30, 50]"
          :page-size="pageInfo.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>

      <el-dialog
        title="二维码"
        width="30%"
        :visible="isShwoQr"
        @close="onCloseQr"
      >
        <el-row type="flex" justify="center">
          <!-- canvas 标签 -->
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>

      <!-- 添加部门的弹框 -->
      <!-- 抽离组件的目的：是让没文件里面的代码量不要过多；好维护 -->
      <!-- v-model <==> :value @input -->
      <!-- 想改默认的属性和事件： -->
      <EmployeeDialog v-model="isVisible" @update-list="loadList" />

      <!-- 分配权限的弹框 -->
      <!-- 解决刚刚描述的问题: 可以通过非常暴力的手段，直接 v-if -->
      <!-- v-show style: display: none -->
      <!-- 文档：尽量能用 v-show 的，就是用 v-show -->
      <!-- 特殊的场景的可以使用 -->
      <RoleDialog v-if="isShowAllot" ref="roleDialogRef" :is-show.sync="isShowAllot" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployeeById } from '@/api/employee'
import employee from '@/api/constant/employees'
import defaultImg from '@/assets/common/bigUserHeader.png'
import EmployeeDialog from './components/employee-dialog.vue'
import QrCode from 'qrcode'
import RoleDialog from './components/role-dialog.vue'

// 在父组件中加载子组件（父组件和子组件的生命周期钩子函数是怎么执行的？）
// 先父bc -> 父m -> 子 bc -> 子 m
// 先父bc -> 子bc -> 子 m -> 父m

// 总结：如果有多个组件进行嵌套的话，是会先执行父组件的 beforeCreate ，再依次创建和挂载子组件（beforeCreate ed bm mounted），最后走
// 父组件的 mounted

export default {
  name: 'EmployeePage',
  components: {
    EmployeeDialog,
    RoleDialog
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      hireType: employee.hireType,
      defaultImg,
      isVisible: false,
      isShwoQr: false,
      isShowAllot: false
    }
  },
  beforeCreate() {
    console.log('父beforeCreate')
  },
  mounted() {
    console.log('父mounted')
    this.loadList()
  },
  methods: {
    async loadList() {
      const { rows, total } = await getEmployeeList(this.pageInfo)

      // 演示，朝列表中添加属性（测试用的）
      rows.forEach(item => {
        item.enableState = 1
      })

      this.list = rows
      this.total = total
    },
    formatEmployee(row, column, cellValue, index) {
      // 在这里去处理具体显示什么内容
      // 拿着 cellValue 去 hireType 里面去对比一下，最终返回 value 值给用户看
      const hire = this.hireType.find(item => item.id === +cellValue)
      return hire ? hire['value'] : '未知'
    },
    handleSizeChange(newSize) {
      this.pageInfo.size = newSize
      this.loadList()
    },
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage
      this.loadList()
    },
    async onDel(id) {
      // 原生浏览器提供的确认提示框(res -> true/false)
      // const res = confirm('确定要删除该员工吗？')

      // elementUI 提供的提示框(res -> confirm/cancel)

      try {
        const res1 = await this.$confirm('确定要删除该员工吗？')
        // res1 -> confirm
        // console.log(typeof res1) // string
        if (res1 === 'confirm') {
          await delEmployeeById(id)
          this.loadList()
        }
      } catch (error) {
        console.log(typeof error)
        this.$message.info('您取消了删除')
      }
      // if (res) {
      // 现今很多公司依然喜欢通过 .then .then 的形式写
      // delEmployeeById(id).then(res => {
      //   console.log(res)
      // })
      // try {
      //   await delEmployeeById(id)
      //   this.loadList()
      // } catch (error) {
      //   this.$message.error(error.message)
      // }
      // }
    },
    export2Excel() {
      // 实现导出功能（下面这个是啥？自己维护的一套对应关系）
      // 维护出下面这个对象的结构的目的：就是未来你想着导出的 excel 表格的列数有多少，分别是什么
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有的员工列表数据
        const { rows } = await getEmployeeList({ page: 1, size: this.total })
        // rows 就是所有的员工的数据了
        const data = this.formateData(rows, headers)

        // 又需要自行维护数据结构了

        // 导出到表格期间，需要指定参数
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头内容
          data: data, // 导出的数据 [[黑马, 189090909090, 10001, ...], [黑马, 189090909090, 10001, ...], []]
          filename: '', // 导出的 excel 表格的文件名称
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formateData(list, header) {
      // 这里需要维护出一个 二维数据
      return list.map(item => {
        // item -> 服务器返回的数据 { mobile: '13890909090', username: '黑马', .. }
        return Object.values(header).map(key => {
          if (key === 'timeOfEntry' || key === 'correctionTime') {
            // 日期
            return this.formatDate(item[key])
          } else if (key === 'formOfEmployment') {
            // 格式化一下 1 正式 2 非正式
            const person = this.hireType.find(x => x.id === +item[key])
            // return person ? person.value : '未知'

            // ?. 可选链操作符，取不到对应的属性返回 undefined, 如果你返回了 undefined 我就应该给个默认值 未知
            // ?? 空值合并操作符
            // 逻辑或：只要左侧的操作符转成布尔值之后为false的话，一律返回右侧数据
            // 空值合并运算符（??）是一个逻辑运算符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
            // 总结一下：?? 在某些场景下比 逻辑或 会更好的处理数据

            // 0 || 'abc'   false || 'abc'
            // 0 ?? 'abc'   false ?? 'abc'
            return person?.value ?? '未知'
          } else {
          // key -> mobile username
            return item[key] // 这一步就是一个个值了
          }
        })
      })
    },
    formatDate(numb) {
      const date = new Date(numb)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1 + '').padStart(2, '0')
      const day = (date.getDate() + '').padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    showQr(url) {
      console.log(url)
      if (url) {
        this.isShwoQr = true
        // 这句话可以让弹框打开，但是里面的 dom 元素可能还在加载中，所以
        // 不能直接拿元素，应该等一会（组件更新是异步的）
        // 建议，自行钻研：设置二维码前景色，背景色，中间要logo等等

        this.$nextTick(() => {
        // 参数1、真实的 dom 元素
          // 参数2、你要转成二维码的信息
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('请更新头像')
      }
    },
    onCloseQr() {
      this.isShwoQr = false
    },
    allotRole(id) {
      // 仅仅是弹框打开了
      this.isShowAllot = true

      this.$nextTick(async() => {
        // 这么写的前提，你得保证这个组件有吧？
        await this.$refs.roleDialogRef.getLocalRole(id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 20px;

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }

  .staff-img {
    width: 80px;
    height: 80px;
    border-radius: 50%
  }
}
</style>
