// 引入了 操作 cookie 相关的包
import Cookies from 'js-cookie'

// 唯一的字符串 -> key
const TokenKey = 'hrsaas_51_key'

// 唯一的时间戳的字符串
const TimeKey = 'hrsaas_51_time_key'

// 存储时间戳的方法
export function setTime() {
  Cookies.set(TimeKey, +new Date()) // 需要存储当前时间 +new Date()
}

// 获取时间戳的方法
export function getTime() {
  return Cookies.get(TimeKey)
}

// 获取 token 的方法
export function getToken() {
  return Cookies.get(TokenKey)
}

// 将 token 朝 cookie 里面存储
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 将 token 从 cookie 中删除
export function removeToken() {
  return Cookies.remove(TokenKey)
}
