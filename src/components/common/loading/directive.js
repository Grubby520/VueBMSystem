import Vue from 'vue'
import Loading from './WLoading.vue'
const MessageConstructor = Vue.extend(Loading)

const loadingDirective = {}
loadingDirective.install = Vue => {
  const toggleLoading = (el, binding) => { // el 绑定的dom
    if (binding.value) {
      Vue.nextTick(()=>{
        if (!el.style['position']) { el.style['position'] = 'relative' }
        el.appendChild(el.loadingDom)
      })
      // el.instance.visible = true
    } else {
      el.instance.close()
    }
  }

  Vue.directive('Wloading', {
    bind: function(el, binding, vnode) { // 初始化
      const textExr = el.getAttribute('element-loading-text')
      const loadingInstance = new MessageConstructor({
        el: document.createElement('div'),
        data:{
          text:textExr
        }
      })
      el.instance = loadingInstance
      el.loadingDom = loadingInstance.$el
      binding.value && toggleLoading(el, binding)
    },
    update: function(el, binding) {
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding);
      }
    },

  })
}

export default loadingDirective
