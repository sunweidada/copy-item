const getters = {
  // 建立对子模块的便捷访问方式
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 暴露 user 模块里面的 token
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  menus: state => state.user.userInfo.roles.menus,
  routes: state => state.permission.routes,
  points: state => state.user.userInfo.roles.points
}
export default getters
