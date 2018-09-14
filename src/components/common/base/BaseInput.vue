<template>
  <div class="input-wrapper"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <input
      ref="input"
      :type="type"
      :class="[
        size ? 'input-text-'+size : 'input-text',
        {
          'input-prefix':iconPreFix,
          'input-fix':iconFix,
          'radius':isRadius
        }
      ]"
      :placeholder="placeholder"
      autocomplete="off"

      @focus="handleFocus"
      @input="handleInput"
      @blur="handleBlur"
      @keyup.13="handleKeyUp"
      v-model="curValue"
      :readonly="readonly"
    >
    <!--前面的图标-->
    <i v-if="iconPreFix" class="icon icon-prefix" :class="iconPreFix"></i>
    <!--后面的图标-->
    <i class="icon " @click="clear" :class="[showClear?'icon-clear':iconFix]"></i>
    <!-- <slot name="icon"></slot> -->
  </div>
</template>
<script>
import emitter from '@/components/mixins/emitter.js'
export default{
  props: {
    value: [String, Number],
    placeholder: String,
    iconPreFix: { // 前面的icon
      type: String,
      default: ''
    },
    iconFix: { // 后面的icon
      type: String,
      default: ''
    },
    isRadius: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    readonly: {
      type: Boolean
    },
    size: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  mixins: [emitter],
  data () {
    return {
      curValue: this.value || '',
      hovering: false,
      focusing: false
    }
  },
  computed: {
    showClear () {
      return (!!this.curValue && (this.focusing || this.hovering)) && this.clearable
    }
  },
  watch: {
    value (val, oldValue) {
      this.curValue = val
    }
  },
  methods: {
    handleFocus (e) {
      this.focusing = true
      this.$emit('focus', e)
    },
    handleInput (e) {
      this.$emit('input', e.target.value)
    },
    handleBlur (e) {
      this.focusing = false
      this.$emit('blur', e)
      this.dispatch('WFormItem', 'formItem.blur', e)
    },
    handleKeyUp () {
      this.$emit('keyup')
    },
    clear () {
      if(!this.clearable) return
      this.clearable = false
      this.curValue = null
      this.$emit('clear')
      this.$emit('input', this.curValue)
      this.$refs.input.focus()
    }
  }
}
</script>
<style lang="scss" scoped>
  .input-wrapper{
    position: relative;
    display:inline-block;
  }
  .icon-clear{
    position: absolute;
    width:10px;
    text-align:center;
    position: absolute;
    top: 50%;
    right: 4px;
    background: #ccc;
    height: 10px;
    border-radius: 50%;
    transform: translateY(-50%);
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #fff;
      transform: rotate(45deg) translateY(-50%);
    }
    &::after{
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #fff;
      transform: rotate(-45deg) translateY(-50%);
    }
  }
  input.input-prefix{
    padding-left:30px;
  }
  input.input-fix{

  }
  .icon-prefix{
    height:20px;
    width:20px;
    position: absolute;
    left: 7px;
    top: 45%;
    transform: translateY(-50%);
  }
</style>
