import Vue from 'vue'
import message from './WMessage'
let MessageConstructor = Vue.extend(message)

let instance
const Message = function (opts = {}) {
  if (typeof opts === 'string') {
    opts = {
      message: opts
    }
  }
  instance = new MessageConstructor({
    data: opts
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
}

export default Message
