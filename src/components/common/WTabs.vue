<template>
  <div class="w-tabs">
    <el-tabs v-model="sf_activeName" @tab-click="handleClick">
      <slot></slot>
    </el-tabs>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Tabs} from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  export default {
    data(){
      return {
        sf_activeName:this.activeName
      }
    },
    props:{
      activeName:{
        type:String
      },
      handleClick:{
        type:Function
      }
    }
  }
</script>

<style lang="scss" scoped>
  //去掉默认组件下面的滚动槽
  * /deep/ {
    
    .el-tabs__nav-wrap::after {
      height: 0;
    }

    .el-tabs__active-bar {
      top:0;
    }
  }
</style>

    