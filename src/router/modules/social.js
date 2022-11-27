import Layout from '@/layout'

export default {
  path: '/social',
  name: 'social_securitys',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/social'), // 展示部门组织的组件
      meta: {
        title: '社保管理',
        icon: 'table'
      }
    }
  ]
}
