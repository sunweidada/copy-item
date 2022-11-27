import request from '@/utils/request'

// 获取所有角色列表
export const getAllRoleList = (params) => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

// 根据id查询企业
export const getCompanyInfo = (id) => {
  return request({
    method: 'GET',
    url: `/company/${id}`
  })
}

// 根据ID删除角色
export const delRoleById = id => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

// nodejs url请求设计的风格：restful 风格（url都是一样，请求 get；删除 delete；查请求 get；确认编辑；put；添加 post）

// post get put delete

// 添加角色
export const addRole = (data) => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

// 根据 roleId 获取角色详情
export const getRoleDetailById = (id) => {
  return request({
    method: 'GET',
    url: `/sys/role/${id}`
  })
}

// 确认编辑
export const editRole = (data) => {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 给角色分配权限
export const allotPerm = (data) => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
