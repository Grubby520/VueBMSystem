<template>
  <div class="Row-wrapper">
      <h3 class="Row-title">
        <slot name="title">
          <span>{{title}}</span>
        </slot>
      </h3>
      <div class="Row-content clearfix" v-Wloading="isLoading">
        <div class="Row-info mb20" >
          <slot name="info"></slot>
        </div>
        <slot name="content"></slot>
        <slot></slot>
      </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    isLoading:false
  }
}
</script>
