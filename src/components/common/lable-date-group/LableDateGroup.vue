<template>
  <div class="lable-group">
    <lable-date-item @click="handleClick" index="0"  type="0">日</lable-date-item>
    <lable-date-item @click="handleClick" index="1"  type="1">周</lable-date-item>
    <lable-date-item class="last-child" @click="handleClick" index="2"  type="2">月</lable-date-item>
  </div>
</template>
<script>
import LableDateItem from './LableDateItem.vue'
export default {
  data () {
    return {
      curIndex: 0
    }
  },
  methods: {
    handleClick (evt) {
      this.curIndex = evt.target.getAttribute('index')
      this.$emit('click', evt)
    }
  },
  components: {
    LableDateItem
  }
}

</script>
<style lang="scss">
  .lable-group {
    border:1px solid #d2d2d2;
    border-radius:2px;
    display: inline-block;
    line-height: 28px;
    vertical-align: middle;
    margin-right:6px;
    a{
      border-right:1px solid #d2d2d2;
      display: inline-block;
      color:#333;
      float:left;
      padding: 0 8px;
      text-decoration: none;
      &:hover, &.active{
        background-color:#25a4f6;
        color:#fff;
      }
      &.last-child{
        border-right:0;
      }
    }

  }
</style>
