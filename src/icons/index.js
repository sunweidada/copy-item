import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component 图标组件

// 注册全局组件（图标）
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// 这三行是干了一件：将 svg 这个文件夹里面的所有文件，一次性都注册成全局可用的组件
