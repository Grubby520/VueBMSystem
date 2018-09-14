<template>
  <div  v-clickoutside="close" class="Select-DropDown">
    <base-input
      @focus="focus"
      ref="Input"
      v-model="inputValue"
      :readonly="!filterable"
      :placeholder="placeholder"
      :clearable="clearable"
      :size="size"
      @keyup.native="inputChange"
      @clear="reset"
      iconFix="icon-triangle">

    </base-input>
    <!-- <input type="text" class="DropDown-info default" placeholder="查询全部" href="javascript:;" /> -->
    <transition
      name="custom-classes-transition"
      enter-active-class="slide-down"
      leave-active-class="slide-up"
    >
      <ul v-show = 'isShow' class="Select-DropDown-list">
        <!-- <li title="查询全部" class="Select-DropDown-list-item">查询全部</li> -->
        <li @click.stop="chose" v-for="(item, index) in curList" :title="item.name" :value="item.id" class="DropDown-list-item" v-text="item.name"></li>
      </ul>
    </transition>

  </div>
</template>
<script>
import BaseInput from '../base/BaseInput.vue'
import clickoutside from 'vue-click-outside'
import emitter from '@/components/mixins/emitter.js'
export default {
  mixins: [emitter],
  props: {
    list: Array,
    size:{
      type:String,
      default:''
    },
    value: [String, Number],
    clearable:{
      type:Boolean,
      default:true
    },
    filterable: {
      type:Boolean,
      default:false
    },
    placeholder:{
      type:String,
      default:'查询全部'
    }
  },
  data () {
    return {
      isShow: false,
      inputValue: '',
      isReadOnly: true,
      // curList: [{id: null, name: this.placeholder}].concat(this.list) || []
      curList: this.list || []
    }
  },
  created () {
    this.initSelect()
  },
  watch: {
    list () {
      // this.curList = [{id: null, name: this.placeholder}].concat(this.list)
      this.curList = this.list
    }
  },
  methods: {
    debouncedOnInputChange () {

    },
    initSelect () {
      this.list.forEach((item) => {
         if(this.value == item.value) this.inputValue = item.name
      })
    },
    reset () {
      // this.curList = [{id: null, name: this.placeholder}].concat(this.list)
      this.curList = this.list
      this.$emit('input', null)
      this.inputValue = ''
    },
    inputChange () {
      this.curList = this.list.filter((item) => {
        return new RegExp(this.inputValue).test(item.name)
      })
    },
    chose (e) {
      this.$emit('input', e.target.getAttribute('value')) // 配合v-mode 实现向父组件传值
      this.dispatch('WFormItem', 'formItem.blur', e)
      this.inputValue = e.target.getAttribute('title')
      this.isShow = false
    },
    focus () {
      this.isShow = true
    },
    close () {
      this.isShow = false
    }
  },
  components: {
    BaseInput
  },
  directives: {
    clickoutside
  }
}
</script>
<style lang="scss">
  @import '../../../assets/scss/component/var.scss';
  .Select-DropDown {
    position: relative;
    display: inline-block;
    position: relative;
  }
  .Select-DropDown-list{
    box-sizing: border-box;
    left: 0px;
    top: 39px;
    width:100%;
    max-height: 300px;
    overflow: auto;
    position: absolute;
    z-index: 999;
    background-color: #fff;
    border: 1px solid #25a4f6;
    // border-right: 1px solid #25a4f6;
    // border-bottom: 1px solid #25a4f6;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .Select-DropDown-list-item{
    line-height: 28px;
    color: $text-color;
    font-size: 12px;
    text-align: left;
    padding-left: 10px;
    padding-right: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover{
        color: #fff;
        background-color: #25a4f6;
    }
  }

  .icon-triangle{
    &::before{
      content:'';
      border-top: 4px dashed;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      position: absolute;
      top: 50%;
      transform: translate(50%, -50%);
      right: 50%;
    }
    // &::after{
    //   content: "";
    //   height: 100%;
    //   width: 0;
    //   display: inline-block;
    //   vertical-align: middle;
    // }
    height:100%;
    position: absolute;
    width:20px;
    right: 0px;
    top:0px;
    text-align:center;
    // transition:transform 0.3s ease 0s;
    .icon-triangle::before{
      transform: rotate(-180deg);
    }
  }

</style>
