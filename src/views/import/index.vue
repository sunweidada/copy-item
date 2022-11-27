<template>
  <div>
    <!-- 使用上传 excel 组件 -->
    <upload-excel :on-success="onSuccess" />
  </div>
</template>

<script>
import { batchEmployee } from '@/api/employee'

export default {
  name: 'ImportPage',
  data() {
    return {
      abc: 123
    }
  },
  methods: {
    async onSuccess({ header, results }) {
      // header -> ['姓名', '手机号']
      // reuslts -> [{ '姓名': '黑马', '手机号': 18990909090 }]
      // want: [{ mobile: 1899090, username: '黑马' }]

      // 干的事，就是要把 results 里面的对象里面的 key，原来是中文的，要改成对应的英文

      // 目前我们还没有中文和对应的英文之间的对应关系（自行维护一个对应关系）
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }

      const needResolveFields = ['timeOfEntry', 'correctionTime', 'ax', 'asd']

      const data = results.map(item => {
        // item -> { '姓名': '黑马', '手机号': 18990909090 }
        const userInfo = {}

        Object.keys(item).forEach(key => {
          // key -> '姓名' '手机号'

          // 需要额外对入职和转正日期处理
          // 现在是一个个判断字段
          // if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
          if (needResolveFields.includes(userRelations[key])) {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })

        return userInfo
      })

      // 进行批量导入员工（待会需要处理：聘用形式、入职时间、部门）
      try {
        await batchEmployee(data)
        this.$message.success('批量导入成功')
        // 返回到上一个页面
        // this.$router.back()
        this.$router.go(-1) // 表示访问上一个页面  push push push  访问记录（浏览器后退按钮，长按可以出现）
      } catch (error) {
        this.$message.error('批量导入失败')
      }
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70) // 往前推了 70 年
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>
