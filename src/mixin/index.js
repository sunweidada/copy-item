import store from '@/store'

export default {
  methods: {
    checkPermission(point) {
      return store.getters.point.includes('point')
    },
    sum(a, b) {
      return a + b
    }
  },
  data() {
    return {
      a: 1
    }
  }
}
