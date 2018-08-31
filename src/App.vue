<template>
  <div id="app" class="clearfix">
    <router-view />
  </div>
</template>
<script>
require('@/assets/fonts/symbol/symbol.js')
export default{
  created () {
    console.log('APP is created!')
    // 数据持久化
    // this.$store.commit('setUserInfo', JSON.parse(window.sessionStorage.loginUserBaseInfo))
  }
}
</script>
<style lang="scss">
  @import './assets/scss/wishstack';
</style>
