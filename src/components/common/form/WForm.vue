<template>
  <form >
    <slot></slot>
  </form>
</template>
<script>
import emitter from '@/components/mixins/emitter.js'
export default{
  name: 'WForm',
  props: {
    model: Object,
    rules: Object // 验证规则
  },
  mixins: [emitter],
  data () {
    return {
      formItems: [] // 需要验证的内容
    }
  },
  created () {
    this.$on('form.addFormItem', (formItem) => {
      if (formItem) {
        this.formItems.push(formItem)
      }
    })

    this.$on('form.removeFormItem', (formItem) => {
      if (formItem.name) {
        this.formItems.splice(this.formItems.indexOf(formItem), 1)
      }
    })

    this.$on('blur', () => {
      alert('blur')
    })
  },
  methods: {
    validate (callback) {
      let promise
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0
      // 如果需要验证的formItems为空，调用验证时立刻返回callback
      if (this.formItems.length === 0 && callback) {
        callback(true)
      }
      // let invalidformItems = {}
      this.formItems.forEach(field => {
        field.validate('', (message, field) => {
          if (message) {
            valid = false
          }
          // invalidformItems = objectAssign({}, invalidformItems, field)
          if (typeof callback === 'function' && ++count === this.formItems.length) {
            // callback(valid, invalidformItems)
            callback(valid)
          }
        })
      })

      if (promise) {
        return promise
      }
    },
    resetFormItems () {
      this.formItems.forEach(item => {
        item.resetField()
      })
    },
    clearValidate () {
      this.formItems.forEach(item => {
        item.clearValidate()
      })
    }
  }
}
</script>
