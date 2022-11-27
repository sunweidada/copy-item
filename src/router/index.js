import Vue from 'vue'
import Router from 'vue-router'

// 注册路由
Vue.use(Router)

/* 引入了 布局组件（左侧侧边栏，顶部导航栏，中间主体区域） */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 动态路由（要有权限才能访问到的）
import approvalsRoute from '@/router/modules/approvals'
import attendancesRoute from '@/router/modules/attendances'
import departmentsRoute from '@/router/modules/departments'
import employeesRoute from '@/router/modules/employees'
import permissionRoute from '@/router/modules/permission'
import salarysRoute from '@/router/modules/salarys'
import settingRoute from '@/router/modules/setting'
import socialRoute from '@/router/modules/social'

export const asyncRoutes = [
  approvalsRoute,
  attendancesRoute,
  departmentsRoute,
  employeesRoute,
  permissionRoute,
  salarysRoute,
  settingRoute,
  socialRoute
]

/**
 * 静态路由：所有角色都可以进入的页面
 */

export const constantRoutes = [
  {
    path: '/login',
    // component: LoginComponent,
    // 属于路由懒加载的写法（好处：只有当用户访问到 /login 这个页面地址的时候，该组件才会被加载）
    component: () => import('@/views/login/index'),
    hidden: true // 如果路由对象中有这个属性，就表示这个路由不需要在左侧侧边栏显示
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    // 每个页面都使用 layout 作为一级路由
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard', // /dashboard
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // meta 定义路由的 元信息（琐碎的信息）
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  // 导入的路由
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '', // 默认子路由
        component: () => import('@/views/import')
      }
    ]
  }
]

// 创建路由实例的方法
const createRouter = () => new Router({
  // mode: 'history', // require service support（如果用的是 / 模式的话，是需要服务端支持的，很容易出现 404 问题）
  scrollBehavior: () => ({ y: 0 }), // 表示当你切换到新路由的时候，可以保证页面滚到顶部
  // 定义路由规则, 路由表
  // routes: [...constantRoutes, ...asyncRoutes,
  //   // 404 必须在路由规则的最后一条
  //   { path: '*', redirect: '/404', hidden: true }] // 临时合并所有的路由
  routes: constantRoutes
})

// 接收路由实例
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由的
}

export default router
