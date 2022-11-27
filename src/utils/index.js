/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 将列表结构转成树形结构
// export function list2Tree(depts, rootValue) {
//   // rootValue 表示一级部门的 pid 是什么 ''
//   // console.log(depts)
//   // 经过分析，我们发现 部门B pid 如果等于 部门A 的id的话，说明 部门B 是 部门A 子部门
//   // 一级部门的 pid 为空字符串

//   // 应该去将 depts 转成 树形结构了 [] reduce

//   // 处理函数的参数：prev: 先前值、初始值
//   // curr: 当前值
//   // index: 当前值所在的索引（省略）
//   // arr: 就是你当前遍历的数组（省略）
//   return depts.reduce((prev, curr, index, arr) => {
//     // 开始遍历了，开始从数组里面找（应该拿着 rootValue 去数组里面找：item.pid === rootValue）
//     curr.children = arr.filter(item => item.pid === curr.id) // [] [{}, {}]
//     // 相当于给每个人添加了一个 children 这个属性
//     // 最终我要去收集数据到 prev 里面去
//     if (curr.pid === rootValue) {
//       // prev 里面装的都是一级部门
//       prev.push(curr)
//     }
//     return prev
//   }, [])
// }

// 1、B 的 pid 和 A 的 id 相等的话，B 是 A 的子部门
// 2、一级部门的 pid 都是 ''

// list2Tree(列表的数据, '0')

export const list2Tree = (depts, rootValue) => {
  // rootValue 记录一级部门的 pid

  // reduce 累加，累积；具有收敛和自定义数据结构的作用
  return depts.reduce((prev, curr, index, arr) => {
    // 开始给每个人开始找，找子部门（curr.id === 每个人的 pid）

    // 按照条件给 当前 curr 找子部门（[{}{}]   []）
    const ele = arr.filter(item => item.pid === curr.id) // []

    if (ele.length) {
      curr.children = ele
    }

    // curr 本身就是二级部门，三级

    // 返回值会在作为下一次循环的初始值
    if (curr.pid === rootValue) {
      // 当前部门的 pid 为 '' 时，是一级部门
      prev.push(curr)
    }

    return prev // [都应该是一级部门]
  }, [])
}
