// 部门相关的请求

import request from '@/utils/request'

// 获取全部的组织架构部门列表信息
export const getDepartments = () => {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

// 删除部门
export const delDepartmentById = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

// 添加部门
export const addDepartment = (data) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

// 获取员工简单列表
export const getSimpleList = () => {
  return request({
    method: 'GET',
    url: '/sys/user/simple'
  })
}

// 编辑（1、回显一个接口 2、确认编辑接口）
// 根据ID查询部门详情
export const getDeptDetailById = (id) => {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}

// 根据 id 修改部门详情
export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
