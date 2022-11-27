// 部门相关的路由模块 /departments

import Layout from '@/layout'

export default {
  // 跟部门相关的路由
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/departments'), // 展示部门组织的组件
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
