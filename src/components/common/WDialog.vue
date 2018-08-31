<template>
  <transition name="fade">
    <div v-show="dialogVisible" class="w-dialog-wrapper" style="display: block;">
      <div class="w-dialog">
        <div class="w-dialog-header">
          <button type="button" @click="close" class="pageIconFont  w-close icon-migrate-fail" data-dismiss="w-dialog"><span class="icon-delet2" aria-hidden="true" style="font-size:16px;color:#333; opacity:1;"></span></button>
          <p class="w-dialog-title">
            <slot name="title">
              <span>{{title}}</span>
            </slot>
          </p>
        </div>
        <div class="w-dialog-body">
          <slot></slot>
        </div>
        <div class="w-dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: this.visible || false
    }
  },
  watch: {
    visible () {
      this.dialogVisible = this.visible
    }
  },
  methods: {
    close () {
      this.dialogVisible = false
      this.$emit('update:visible', false) // 通知父组件修改属性值
    }
  },
  computed: {
    // dialogVisible(){
    //   return this.dialogVisible && this.visible
    // }
  }

}
</script>
<style lang='scss'>
  @import '../../assets/scss/component/_var';
  .w-dialog-wrapper{
    background: rgba(0,0,0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 800;
  }
  .w-dialog{
    top: 50%;
    transform: translateY(-50%);
    position: relative;
    margin: 0 auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-sizing: border-box;
    width: 50%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .5);
    position: relative;
    background-color: #fff;
  }
  .w-dialog-header{
    background-color: #fff;
    padding: 15px;
  }
  .w-dialog-title{
    color: #333!important;
    font-size: 16px;
    text-align: left;
    font-weight: bolder;
  }
  .w-dialog-footer{
    padding: 10px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
  }
  .w-dialog-body{
    padding: 10px;
  }
  .w-close{
    float: right;
    background:#fff;
    cursor:pointer;
    color:$icon-color-default;
    &:hover{
      color:$icon-color-hover;
    }
  }
</style>
