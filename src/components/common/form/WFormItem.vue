<template>
  <div class="form-row">
      <label class="form-row-label side">{{label}}<i v-if='isRequired'>*</i></label>
      <div class="main">
        <slot></slot>
        <p class="form-row-tip error" v-if="validateState === 'error'">
          <i class="Icon Icon-tip-error"></i>{{validateMessage}}
        </p>
      </div>
  </div>
</template>

<script>
import schema from 'async-validator'
import emitter from '@/components/mixins/emitter.js'

export default{
  name: 'WFormItem',
  data () {
    return {
      form: '',
      validateState: '',
      validateMessage: ''
      // initialVal:''
    }
  },
  mixins: [emitter],
  props: {
    label: {
      type: String
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    name: { // 对应规则key
      type: String
    },
    rules: [Object, Array]
  },
  mounted () {
    var parent = this.$parent
    while(parent && (parent.$options.name !== 'WForm')){
      parent = parent.$parent
    }
    this.form = parent

    // 保存初始值
    // this.initialVal = this.form.model[this.name]

    if (this.name) { // 需要验证
      this.dispatch('WForm', 'form.addFormItem', this)

      if (this.form.rules.length || this.isRequired !== undefined) {
        this.$on('formItem.blur', this.validate)
        // this.$on('el.form.change', this.onFieldChange)
      }
    }
  },
  computed: {
    initialVal () {
      return this.form.model[this.name]
    }

  },
  methods: {
    getRules () {
      return [].concat(this.form.rules[this.name] || this.rules)
    },
    validate (e, callback) {
      const descriptor = {}
      descriptor[this.name] = this.getRules() // 建立schema验证

      const keyVal = {}
      keyVal[this.name] = this.form.model[this.name]

      const validator = new schema(descriptor)
      validator.validate(keyVal, (errors, fields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback && callback(this.validateMessage, fields)
      })
    },
    resetFormItem () {
      this.validateState = ''
      this.validateMessage = ''
      this.form.model[name] = this.initialVal
    },
    clearValidate () {

    }
  }
}
</script>
