import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '', // 当二级路由的 path 为 '' 的时候，为默认子路由
      component: () => import('@/views/employees'), // 展示部门组织的组件
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    // 定义员工详情 动态路由
    // 如果你要定义的 路由，既可以是动态传参的，也可以不传，可以在 动态参数后面 加一个问号，表示可选的意思
    // path: 'detail/:id?'
    {
      path: 'detail/:userId', // 如果你加 / 的话，人家会认为你是一级路由
      // 真正访问的路径：/employees/detail
      component: () => import('@/views/employees/components/detail'),
      // 定义路由期间，是可以开启 props 传参的
      // props: Object || Boolean || Function
      props: true,
      // props: ({ name: 'heima', age: 20 })
      // props: (v) => { // 如果是函数类型的话，参数默认就是路由对象（params path hash patch）
      //   // debugger
      //   return ({ name: 'zlc', age: 30, userId: v.params.userId })
      // },
      hidden: true
    },
    {
      // 通过 query 传递参数的时候，需要在设计路由的时候指定吗？不需要
      // /employees/print/id?type=personal
      // /employees/print/id?type=job
      path: 'print/:id',
      component: () => import('@/views/employees/components/print'),
      hidden: true
    }
  ]
}
