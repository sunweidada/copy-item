import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/permission'), // 展示部门组织的组件
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
