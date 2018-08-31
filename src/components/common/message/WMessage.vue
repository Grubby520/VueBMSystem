<template>
  <transition name="message-fade">
    <div class="message"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      v-show="visible"
    >
      <i class="icon"
        :class = "[type ? `icon-message-${ type }` : '',]"
      ></i>
      <p>
        <slot>{{message}}</slot>
      </p>
    </div>
  </transition>
</template>
<script>
export default{
  // props:{
  //   type:{
  //     type:String,
  //     default:'correct'
  //   },
  //   message:{
  //     type:String
  //   },
  //   visible:false,
  //   duration:{
  //     type:Number,
  //     default:3000
  //   }
  // },
  data () {
    return {
      type: 'success',
      message: null,
      visible: false,
      duration: 3000,
      timer: null
    }
  },
  mounted () {
    this.startTimer()
  },
  methods: {
    startTimer () {
      this.timer = setTimeout(() => {
        if (this.visible) {
          this.visible = false
          this.destroyElement()
        }
      }, this.duration)
    },
    clearTimer () {
      clearTimeout(this.timer)
    },
    destroyElement () {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>
<style lang="scss">
  .icon{
    background-size:100%;
  }
  .message{
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    z-index:1000;
    position: fixed;
    top:120px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 4px;
    padding: 12px 18px;
    max-width: 345px;
    transition: opacity 0.3s, transform .4s;
    background: rgba(0,0,0,0.6);
    p{
      display: inline-block;
      color: #FFF;
      font-size: 14px;
      flex:1;
      word-break: break-all;
    }
  }
  .icon-message-success{
    display: inline-block;
    background-image: url(~@/assets/image/icon-success.png);
    width:26px;
    height:26px;
    margin-right: 18px;
  }
  .icon-message-error{
    display: inline-block;
    background-image: url(~@/assets/image/icon-error.png);
    background-repeat:no-repeat;
    width:26px;
    height:26px;
    margin-right: 18px;
  }
  .icon-message-info{
    display: inline-block;
    background-image: url(~@/assets/image/icon-info.png);
    width:26px;
    height:26px;
    margin-right: 18px;
  }
  .message-fade-enter,.message-fade-leave-active-to{
    opacity: 0;
    transform: translate(-50%, -100%);
  }
</style>
