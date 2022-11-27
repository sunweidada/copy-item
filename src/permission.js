// 处理页面权限控制相关的模块

import router from './router'
import store from './store'

const whiteList = ['/login', '/404']

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // 看有没有token
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
    //   this.$router.push('/')
      // 原来我们在组件里面用：this.$router.push 这里的 this 指向的是当前组件.$router $route
      //   console.log(this)  js 文件里面的 this 指向 undefined，不能在 js 文件里面 使用 this.$router
      next('/')
    } else {
      // console.log(store)
      // 可以在这里去请求用户信息（也不是每次都要去请求的）
      // debugger
      // if (!store.state.user.userInfo?.userId) {
      if (!store.getters.userId) {
        await store.dispatch('user/asyncGetUserInfo')
        const menus = store.getters.menus
        const newRoutes = await store.dispatch('permission/filerRoutes', menus)
        router.addRoutes([...newRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 再看你去的页面属于白名单列表吗？
    // 如果是在白名单里面，直接放行即可
    // 否则，就感觉给我滚去登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

// import router from './router'
// import store from './store'

// // 提示消息组件
// import { Message } from 'element-ui'

// // 进度条组件
// import NProgress from 'nprogress'

// // 进度条组件的样式
// import 'nprogress/nprogress.css'

// // 引入了 获取 token 的方法
// import { getToken } from '@/utils/auth'

// // 设置页面标题的方法
// import getPageTitle from '@/utils/get-page-title'

// // 进行了 进度条的默认配置
// NProgress.configure({ showSpinner: true })

// // 设置白名单列表
// const whiteList = ['/login', '/404'] // 这里定义的路由是不需要访问权限的

// // 前置守卫 - 当你页面准备开始跳转之前会执行 页面A -> 页面B的时候
// router.beforeEach(async(to, from, next) => {
//   // 开启进度条效果
//   NProgress.start()

//   // 设置页面的标题
//   document.title = getPageTitle(to.meta.title)

//   // 让 获取 token 的方法执行，然后去用常量 hasToken 接收了一下，然后拿着这个常量去判断，当前这个用户是否处于登录状态
//   const hasToken = getToken()

//   if (hasToken) {
//     // token 有值的情况下
//     if (to.path === '/login') {
//       // 又判断了，你去的路径 是 登录页码？
//       // 如果你处于登录状态了，就不要再进登录页面，直接重定向到 首页
//       next({ path: '/' })

//       // 关闭, 结束进度条效果
//       NProgress.done()
//     } else {
//       // 判断处于登录页面，但是要去的地方不是登录页
//       const hasGetUserInfo = store.getters.name
//       // 一开始 hasGetUserInfo ，为 空字符串
//       if (hasGetUserInfo) {
//         next() // 有 token 并且能获取 用户名称，直接放行
//       } else {
//         // 取 user 子模块里面 name 为空话
//         try {
//           // 用来获取用户信息（给全局状态里面的 name 和 avatar 做更新）
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // 移除token，然后去 登录重新登录
//           await store.dispatch('user/resetToken')

//           // 提示了一个错误消息
//           Message.error(error || 'Has Error')

//           // 重定向到登录页面，并且记录是从哪跳转到登录页的；后续，再登录成功之后，应该再恢复之前的操作的
//           next(`/login?redirect=${to.path}`)

//           // 进度条效果关闭
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     // 没有 token 的情况下

//     if (whiteList.indexOf(to.path) !== -1) {
//       // 你要去的地址如果是在 白名单里面的话，直接放行
//       next()
//     } else {
//       // 说明，你去的地方，是有权限的其他页面
//       // 让你重新去登录
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// // 后置守卫 - 页面A 真正跳转到 页面B的时候
// router.afterEach(() => {
//   // 直接关闭进度条效果
//   NProgress.done()
// })
