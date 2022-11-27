// 这里定义工程需要的自定义指令

// Vue.directive('abc', {
//     inserted(el, binding) {
//         binding.value =
//     }
// })

// 定义图片指令（处理图片没有正常加载的情况）
export const imgerror = {
  inserted(el, binding) { // 什么时候会执行？当指令所附着的 dom 元素，真正的插入到 dom 文档当中的时候会执行
    el.onerror = function() {
      // 当图片没有正常加载的时候 给一个 默认值
    //   console.log('图片加载失败了', binding.value)
      el.src = binding.value
    }
  }
}
