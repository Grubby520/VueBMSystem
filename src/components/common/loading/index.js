import Vue from 'vue'
import loading from './WLoading'
let LoadingConstructor = Vue.extend(loading)

let instance
const Message = function (options = {}) {
  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target)
  }
  options.target = options.target || document.body
  instance = new LoadingConstructor({
    data: options
  })
  instance.vm = instance.$mount()

  options.target.appendChild(instance.vm.$el)
  return instance
  // instance.vm.visible = true
}

export default Message
