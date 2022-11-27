<template>
  <!-- action	必选参数，上传的地址（表示你要上传的图片传到哪儿） -->
  <!-- list-type="picture-card" 设置上传样式为 照片墙 -->
  <!-- limit	最大允许上传个数 -->
  <!-- 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]  -->
  <!-- 重新构建上传动作：http-request	覆盖默认的上传行为，可以自定义上传的实现 -->
  <!-- before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 -->
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :before-upload="onBeforeUpload"
      :http-request="onHttpRequest"
      :class="{
        'img-upload': fileList.length === 1
      }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- text-inside 表示进度条显示文字内置在进度条内 -->
    <!-- stroke-width 表示进度条的宽度 -->
    <!-- percentage 表示百分比 -->
    <el-progress v-show="isShowPercent" :text-inside="true" style="width: 150px; margin-top: 5px" :stroke-width="26" :percentage="percentage" />

    <el-dialog :visible="isShow" title="预览图片" width="30%" @close="onClose">
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

// 时间安排：挺充足
// 自身原因：想12、1月份出去看看，口罩戴一下（找几份写的不错的简历，跟着写 - 提前模拟面试）
// 建议：年后（小程序，react还没学完，vue3）

const cos = new COS({
  SecretId: 'AKIDFMGzXS8dy63oNlx1xvLZeYGnAJEvSnsj',
  SecretKey: 'hEYL9sPhw9IVsATmxENNBlBPPPRahis0'
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      isShow: false,
      imgUrl: '',
      currUid: '',
      percentage: 0,
      isShowPercent: false
    }
  },
  methods: {
    onPreview(file) {
      // file 就是你预览的图片信息
      this.imgUrl = file.url
      this.isShow = true
    },
    onRemove(file, fileList) {
      // 需要将 fileList 置空
      // this.fileList = fileList
      this.fileList = []
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange(file, fileList) {
      console.log(file, fileList)
      // this.fileList.push(file) // 不能这么操作（change事件是会执行多次的）
      // if (fileList) {
      this.fileList = fileList.map(item => item)
      // }
    },
    onBeforeUpload({ size, type, uid }) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/webp']
      if (!types.includes(type)) {
        this.$message.warning(`您上传的图片格式 ${type}不合法，请重新上传`)
        return Promise.reject(`失败`)
      }

      // size: b
      // 检查文件大小 只能允许5M 1M === 1024kb   1kb === 1024b
      // 风景图片
      const maxSize = 5 * 1024 * 1024
      if (size > maxSize) {
        this.$message.warning(`您上传的图片过大，请重新上传`)
        return false
      }

      console.log('检查通过')
      // 这个位置，说明文件检查已经通过了，后面上传的就是你刚刚选择的这个图片
      this.currUid = uid
      return true // 返回的 true，是告诉组件可以继续进行上传动作
    },
    onHttpRequest(params) {
      console.log(params)
      this.isShowPercent = true
      // 经过观察，parmas 里面 的 file 属性是你要真正上传到腾讯云服务器的真实文件
      const file = params.file

      // putObject 是腾讯云提供的上传简单文件的方法
      cos.putObject({
        // 存储桶的名词
        Bucket: '2624556194-1315219409', /* 填入您自己的存储桶，必须字段 */
        // 地域
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */

        // 你上传的图片名称
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        // 就是你要上传的真实的文件了
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */

        // 监听上传图片期间的进度的回调（1% 20% 80% 100%）
        onProgress: (progressData) => {
          // loaded 已经加载了多少
          // total 表示你上传的文件总共有多少   (loaded / total) * 100%
          // speed 速度的意思
          // percent 上传的百分比数据
          // console.log(JSON.stringify(progressData))
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        if (!err && data?.statusCode === 200) {
          // 说明上传成功了
          // fileList: [{ url: '' }]
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currUid) {
              // 自行添加的 upload 属性，后面会用到（区分）
              return {
                url: 'https://' + data.Location,
                upload: true
              }
            }
            return item
          })

          // 上传结束
          setTimeout(() => {
            // 关闭进度条显示
            this.isShowPercent = false
            // 让进度条进度归0
            this.percentage = 0
          }, 1500)
        }
      })
    },
    onClose() {
      this.isShow = false
      this.imgUrl = ''
    }
  }
}
</script>

<style scoped lang="scss">

</style>
