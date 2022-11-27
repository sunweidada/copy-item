import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/setting'), // 展示部门组织的组件
      meta: {
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
