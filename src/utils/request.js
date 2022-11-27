// 这里的请求，自己维护
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'

// 之前怎么用的：设置请求的基准路径，这种写法比较弱
// axios.defaults.baseURL = ''

// 比较推荐使用 create 创建一个实例（axios）
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
  // timeout: 5000
})

// 实例身上添加了很多跟拦截器相关的属性（后面只需要朝这个实例身上去挂载你想要的属性就好了）

// Promise 面试重点 -> 总结：一个执行器、两个方法、三个状态（出现的目的：嵌套书写 -> 可以被 Promise 取代 -> 通过 .then .then 将写法展开）
// promise 还是在用回调函数的 形式去解决异步

// .then(onfulfilled => {
//   console.log(onfulfilled)
// })
// 语法糖：async 和 await 配合，是异步编程的终极解决方案（出现的目的：可以将异步代码写成同步）

// 添加请求拦截器（每个请求都会经过的）
service.interceptors.request.use(async config => {
  // 统一为所有请求注入 token
  const token = store.getters.token
  if (token) {
    // 有token，一定代表 token有效吗？
    // 得进一步 看 token 是否处于可以用状态，再去发请求
    if (isTimeout()) {
      // token 失效 -> 需要清空 token、清空 userInfo、跳转到登录页
      // this.$store.dispatch('user/logout')
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token 失效了，请重新登录'))
    }

    // 这里面可以根据需求，再加一些判断

    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, error => {
  // 请求期间出错了，这里会触发
  return Promise.reject(error.message)
})

// 添加响应拦截器
service.interceptors.response.use(res => {
  // 请求（network 请求是通的）成功的时候
  const { data, success, message } = res.data
  // data 是真实服务器返回的数据
  // success 是用来判断当前请求在 200 的情况下，也有可能是有误的数据
  if (success) {
    return data
  } else {
    // 说明当前请求是通的，但是数据有误（依然认为当前请求是失败的）
    // 可以来一个提示消息
    Message.error(message)
    // 还需要返回一个失败状态下的 promise
    return Promise.reject(new Error(message))
  }
}, async erro => {
  // 我可以在这里处理 token 真的失效了（依然需要走 登出那一套[清空token，清空userInfo，跳转到登录重新登录]）
  // 可选链操作符
  if (erro?.response?.data?.code === 10002) {
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(new Error('token 失效了，请重新登录'))
  } else {
    Message.error(erro.message)
  }
  return Promise.reject(erro) // 需要返回一个失败状态下的 promise
})

// 定义一个检查 token 时间是否过期（8h）
const expirsTime = 1 * 60 * 60 * 8 * 1000 // 换算成 毫秒：1 * 60 * 60 * 8 * 1000
// const expirsTime = 3 * 1000

function isTimeout() {
  // 拿两个时间去比对 时间A[就是当前时间] - 时间B[当初登录成功之后存储的时间]
  const prevTime = getTime()

  const currTime = Date.now()

  return currTime - prevTime > expirsTime
}

export default service

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // 这里是 封装请求模块

// // 创建一个 axios 实例的形式
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // 设置请求超时时长
// })

// // 请求拦截器
// service.interceptors.request.use(
//   config => {
//     // 在请求之前，你可以统一的给所有请求干一些事情

//     if (store.getters.token) {
//       // 如果当前有 token 值的情况，统一的给所有请求添加自定义请求头
//       config.headers['Authorization'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error) // 在请求期间如果发生错了，会返回失败状态下的 promise
//   }
// )

// // 响应拦截器
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     // 20000 状态码是自行约定的，如果返回的 code 不是 20000，就视为错误
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       // 50008 -> 不合法的 token
//       // 50012 -> 其他客户端在登录
//       // 50014 -> token 过期
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // 让他重新登录去
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             // 1、移除 token 2、返回登录页重新登录 3、让页面重新刷新一下
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

//
