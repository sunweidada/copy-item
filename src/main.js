import Vue from 'vue'

// 引入了 reset.css 重置样式的文件
import 'normalize.css/normalize.css'

// 引入 ElementUI 组件库
import ElementUI from 'element-ui'
// 引入 ElementUI 组件库必备的样式文件
import 'element-ui/lib/theme-chalk/index.css'

// 引入的国际化 文字的种类（哪国的语言）
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 引入工程必备的样式文件
import '@/styles/index.scss'

import mixin from '@/mixin'
Vue.mixin(mixin)

// 引入打印的插件
import Print from 'vue-print-nb'
Vue.use(Print)

// 引入指令
import * as directives from '@/directives'

// 可以一次性的给所有指令进行注册
Object.keys(directives).forEach(directiveName => {
  Vue.directive(directiveName, directives[directiveName])
})

// 引入过滤器
import * as filters from '@/filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) // 遍历的形式去注册过滤器（这里面的函数的名称就是过滤器的名称）
})

// 引入根组件
import App from './App'

// 引入 vuex 管理数据
import store from './store'

// 引入 router 路由
import router from './router'

// 引入全局组件(是自己维护一个 对象/插件，里面提供一个 install 的方法(Vue) 我们在 install 里面去进行全局注册)
import Components from '@/components'
Vue.use(Components)

// import PageTools from '@/components/PageTools'

// Vue.component('PageTools', PageTools)

// 一次性注册icon
import '@/icons'

// 权限控制
import '@/permission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 *
 * 做 mock 模拟数据用的
 */
// process.env 这个是用来获取当前工程所处的环境（开发环境 development 线上环境 production）

// if (process.env.NODE_ENV === 'production') {
//   // 如果是线上环境的话，会使用 mock 做模拟数据用的
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// console.log(process.env.VUE_APP_BASE_API)

// 设置 elementUI 组件库的语言，默认为 英文
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

// 工程目录放到层级，不要太深！！

/**
 * 1、配置 eslint
 * 2、找到依赖插件：eslint，去安装一下 版本 2.2.6
 * 3、再随便找个文件，单机右键查看 '使用...格式化文档' 观察有没有 eslint 可选项？没有
 * 4、摁下保存键，同时让 eslint 帮我去格式化文档 -> 勾选 onSave 选项
 *
 * eslint 配置完毕在之后，可以帮我们自动修复低级问题
 *
 * hrsaas - hr 人事的意思  saas 系统 - 后管相关的
 * saas -> software as a service 软件即服务   - 最终翻译成：人力资源管理系统软件
 *
 * id: AKIDB7nFUgzU0KJ6ikKAz0nKcg060gDytnvm
 * key: lGp8AxUpSr0vZ6PRebDahMJBn5i8lzBV
 *
 */
