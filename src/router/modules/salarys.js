import Layout from '@/layout'

export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/salarys'), // 展示部门组织的组件
      meta: {
        title: '薪资管理',
        icon: 'money'
      }
    }
  ]
}
