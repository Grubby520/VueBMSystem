<template>
  <div>
    <paeg-header></paeg-header>
    <page-side-bar></page-side-bar>
    <div class="page__content" v-init-screen-h="50">
      <w-crumb :crumbs="crumbs"></w-crumb>
      <div class="container">
        <router-view><p>this is main content</p></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import PaegHeader from '@/views/layout/Header.vue'
import PageSideBar from '@/views/layout/_SideBar.vue'
import WCrumb from '@/components/common/_WCrumb.vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
export default {
  created () {
    console.log('_______1')
    this.$store.commit('setUserInfo', JSON.parse(window.sessionStorage.loginUserBaseInfo))
  },
  computed: {
    ...mapState([
      'crumbs'
    ])
  },
  components: {
    PaegHeader,
    PageSideBar,
    WCrumb
  }
}
</script>
<style lang="scss">
  $contentBgColor:#e7ecf0;
  $sidebarWidth:220px;

  .page__content {
    margin-left: $sidebarWidth;
    box-sizing: border-box;
    overflow-x: auto;
    background-color: $contentBgColor;
  }
  .container {
    box-sizing: border-box;
    padding: 15px;
  }
</style>
