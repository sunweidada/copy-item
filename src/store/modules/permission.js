import { asyncRoutes, constantRoutes } from '@/router'
export default {
  namespaced: true,
  state: {
    routes: constantRoutes
  },
  mutations: {
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes]
    }
  },
  actions: {
    filerRoutes({ commit }, menus) {
      const newRoutes = asyncRoutes.filter(item => menus.includes(item.name))
      commit('setRoutes', newRoutes)
      return newRoutes
    }
  }
}
