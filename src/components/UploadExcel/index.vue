<template>
  <!-- <div> -->
  <!-- 对 input 标签设置 type为file类型的话 -> 就是一个文件选择框 -->
  <!-- change 事件什么时候执行呀？当用户选择了文件之后会执行 -->
  <!-- <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick"> -->

  <!-- drag 拖动的意思 -->
  <!-- <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drop excel file here or
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        Browse
      </el-button>
    </div>
  </div> -->
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>

    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import * as XLSX from 'xlsx' // 新写法

export default {
  name: 'UploadExcel',
  props: {
    // 函数类型
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    // generate 生成的意思
    generateData({ header, results }) {
      // 拿到读取完毕之后的所有列内容和表格内容给当前组件的 excelData 做赋值了
      this.excelData.header = header
      this.excelData.results = results

      // 如果你使用组件的时候，传递了 onSuccess 这个属性，那我就让这个函数执行，并且给你我刚刚读取到的 列 和 内容
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      // 在模拟点击 type为file的 文件选择框
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      // 当用户选择了表格文件，会进入到这里

      // files 属性表示你选择的文件列表
      const files = e.target.files

      // 去文件列表的第一位（就是你刚刚选择的那个文件）
      const rawFile = files[0] // only use files[0]

      // 如果没有取到文件的话，直接啥也不做
      if (!rawFile) return

      // 如果你选择了文件，继续走 upload(真实的 excel file)
      this.upload(rawFile)
    },
    upload(rawFile) {
      // -> this.$refs['excel-upload-input'] 表示 input 框
      // input.value = null 让选择框的 value 为null，意图？

      // 比如你选择了：文件A this.$refs['excel-upload-input'].value = xxx
      // 如果下一次你又选了 文件A，type=file 原生是元素本身会判断（如果上一次选择的文件 value 和 这一次的value一致，那我就不会触发 change 事件了）

      // 文件A,A 下一次应该也可以选择上一次选择过的文件

      // 解决了不能同时选择同一个 excel 的问题
      this.$refs['excel-upload-input'].value = null

      // 如果用户在用这个组件期间，如果没有传入 beforeUpload 这个属性的话，直接走 readerData 方法
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }

      // 让用户传递过来的 beforeUpload 方法执行了（beforeUpload 上传表格之前有可能需要检查一下[文件大小，后缀 等等一些小问题]）
      // 根据 before 是检查动作结束之后（检查通过了）
      const before = this.beforeUpload(rawFile)
      if (before) {
        // 开始读数据
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      // 开启了 按钮加载动画
      this.loading = true

      // 返回了一个 promise 实例
      return new Promise((resolve, reject) => {
        // 执行器（立马执行）
        // 实例化了一个 专门用来读取文件的 实例
        const reader = new FileReader()

        // 监听了 reader 的 onload 方法（window.onload document.onload）
        // 表示下面这个 onload 会在文档读取完毕之后会执行
        reader.onload = e => {
          // 已经读完了

          // data 是真正的excel 读完之后的字节：ArrayBuffer byteLength 9987
          const data = e.target.result
          // 使用了 XLSX 里面的 read 方法，将ArrayBuffer 转成工作簿
          const workbook = XLSX.read(data, { type: 'array' })

          // 就是你的第一个工作簿的名称
          const firstSheetName = workbook.SheetNames[0]

          // 当前的工作簿
          const worksheet = workbook.Sheets[firstSheetName]

          // 获取当前表格里面的头部标题（列标题）
          const header = this.getHeaderRow(worksheet) // 所有的列

          // result -> [{ 姓名: '黑马', 手机号: 18990909090, xxx: xx }]
          const results = XLSX.utils.sheet_to_json(worksheet) // 就是所有表格的内容

          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        // 这个方法是真正读取你上传的 excel 表格
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
   margin-top: 100px;
   .excel-upload-input{
       display: none;
        z-index: -9999;
     }
   .btn-upload , .drop{
      border: 1px dashed #bbb;
      width: 350px;
      height: 160px;
      text-align: center;
      line-height: 160px;
   }
   .drop{
       line-height: 80px;
       color: #bbb;
      i {
        font-size: 60px;
        display: block;
      }
   }
}
</style>
