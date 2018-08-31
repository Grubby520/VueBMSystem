<!-- 状态型标签、显示 -->
<template>
  <span class="label-btn"
    :class="[
      isRadius?'radius':'', type,
      isPointer?'pointer':'',
      isActive?'active':''
    ]"
    @click="handleClick"
  >
    <slot></slot>
  </span>
</template>
<script>

export default {
  props: {
    type:{
      type:String,
      default:'default'
    } ,
    isRadius:{
      type:Boolean,
      default:true
    },
    isPointer:{// 是否可点击
      type:Boolean,
      default:false
    },
    active:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      isActive:this.active
    }
  },
  computed:{
    // isActive(){
    //   return this.active
    // }
  },
  methods: {
    handleClick () {
      // this.$parent.querySelector('.active').className.replace('active', '')
      if(!this.isPointer){ return}
      this.isActive = !this.isActive
      this.$emit('click', this)
    }
  }
}
</script>
