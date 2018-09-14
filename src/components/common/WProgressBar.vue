<template>
  <div class="vue-progress-bar default-theme">
    <div class="vue-progress-bar__tip">
      <span class="vue-progress-bar__tiplabel">{{label}}</span>
      <span class="vue-progress-bar__tiptext">{{text}}</span>
    </div>
    <div class="vue-progress-bar__outer">
      <div class="vue-progress-bar__inner" :style="barStyle"><span v-show='showpercent'>{{percentage}}%</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    text: {
      type: [String, Number]
    },
    height: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0
    },
    color: {
      type: String,
      default: ''
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    },
    showpercent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    barStyle () {
      const style = {}
      style.width = this.percentage + '%'
      style.height = this.height + 'px'
      style.textAlign = 'right'
      style.color = '#fff'
      style.backgroundColor = this.color
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
  .vue-progress-bar.default-theme{
    .vue-progress-bar__outer {
      background: #eee;
    }
  }

  .vue-progress-bar {
    .vue-progress-bar__tiptext {
      float: right;
    }

    .vue-progress-bar__tip {
      margin: 0.5em 0;
      font-size: 12px;
    }
  }
</style>
