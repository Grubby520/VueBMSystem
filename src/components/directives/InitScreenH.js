class InitScreenH {
  /**
   * 构造函数
   */
  constructor () {
    this.clasName = 'InitScreenH'
  }

  get getClassName () {
    return this.clasName
  }

  set setClassName (name) {
    this.clasName = name
  }

  static install (Vue) {
    Vue.directive('init-screen-h', {
      bind (el, binding) {
        let offsetH
        offsetH = binding.value ? binding.value : 0
        // 计算并设置el的高度
        el.style.minHeight = window.innerHeight - offsetH + 'px'
        if (window && window.addEventListener) {
          window.addEventListener('resize', function () {
            el.style.minHeight = window.innerHeight - offsetH + 'px'
          })
        }
      }
    })
  }
}

export default InitScreenH
