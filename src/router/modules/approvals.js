import Layout from '@/layout'

export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/approvals'), // 展示部门组织的组件
      meta: {
        title: '审批管理',
        icon: 'tree-table'
      }
    }
  ]
}
