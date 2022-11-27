import request from '@/utils/request'

// 后面在此处，进行真正的请求逻辑（方法，地址，参数）

// 用户登录
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/sys/login', // 404
    data
  })
}

// 获取用户的基本资料
// 问：这个请求在哪请求比较好？需要 token
export const getUserInfo = () => {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 获取员工基本信息
export const getUserDetailById = userId => {
  return request({
    method: 'GET',
    url: `/sys/user/${userId}`
    // url: `/sys/user`,
    // params: {
    //   id: userId
    // }
  })
}

// 保存员工基本信息
export const saveEmployeeInfo = (data) => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}
