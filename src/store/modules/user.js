
// user 子模块，需要我们自己去维护
import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import store from '..'

const state = {
  token: getToken(), // token 的初始化值，应该先从缓存中读取
  userInfo: {} // 用户信息相关的
}

const mutations = {
  setToken(state, token) {
    // 这个方法能否兼容既能修改 token，也能移除 token？
    state.token = token
    token ? setToken(token) : removeToken()
  },
  setUserInfo(state, userInfo) {
    // 确保对对象的操作具有响应式，可以先保存一份 userInfo 里面的属性
    state.userInfo = { ...userInfo }
  }
}

const actions = {
  async userLogin({ commit }, data) {
    try {
      const token = await login(data)
      // 提交更新 token
      commit('setToken', token)

      // 要立马存储一下当前时间
      setTime()
      return true
    } catch (error) {
      // 清空 token 这里可以知道请求出错之后的原因 弹框，自己分析
      // 需要从0开发一个后台，中台项目
      commit('setToken', null)
      return false
    }
  },
  // 修改数据，永远都在 mutation 里面修改
  async asyncGetUserInfo({ commit }) {
    const data = await getUserInfo()
    // 获取基本信息
    const baseInfo = await getUserDetailById(data.userId)
    // 是上述两个请求回来的结果做了合并，统一给全局状态 userInfo 做赋值
    commit('setUserInfo', { ...data, ...baseInfo })
  },
  logout({ commit }) {
    // 登出，需要 1、清空 token   2、清空 userInfo
    commit('setToken', null)
    commit('setUserInfo', {})
    resetRouter()
    store.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   // user 子模块里面 state 定义了 三个属性：token name avatar
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     // 就是让两个对象进行合并之后，所有的 状态都是空的了
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     // 返回了一个新的 promise 实例
//     return new Promise((resolve, reject) => {
//       // 直接发送请求
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         // 从 data 对象身上解构了 name 和 avatar 这两个属性
//         const { name, avatar } = data

//         // 修改了状态里面的 name
//         commit('SET_NAME', name)
//         // 修改了状态里面的 头像
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // 移除token的操作
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }
