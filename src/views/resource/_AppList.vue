<template>
  <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
    <div class="nav-logo"><span class="pageIconFont icon-organization"></span></div>
    <div class="nav-content">
      <h1 class="page-portrait" id="chooseBtn">
        {{name}}
        <span  class="pageIconFont icon-triangle-bottom page-portrait-icon"></span>
      </h1>
      <slot name="list1"></slot>
      <div class="applist__container">
        <slot name="list2"></slot>
      </div>
    </div>
  </div>
</template>
<script>


export default {
  data(){
    return {

    }
  },
  props: {
    name:String,
  },
  mounted(){

  },
  methods: {



  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .whiteBg {
    background:#fff;
  }
  .nav-logo {
    padding-top:40px;
    padding-bottom:1em;
    &>span {
      display: block;
      height: 60px;
      width: 60px;
      margin: 0 auto;
      line-height: 60px;
      border-radius: 100%;
      font-size:28px;
      color: #fff;
      text-align:center;
      background: #00a0e9;
    }
  }
  .page-portrait-icon{
    color: #00a0e9;
    font-size: 12px;
    margin-left: 0.4em;
  }
  .applist__container {
    margin: 0 auto;
    width: 80%;
  }
  .nav-content {
    position: relative;
    padding: 0 0 1em 0;
    h1 {
      margin: 0;
      text-align: center;
      font-size:16px;
      font-weight: 600;
    }
  }

  .org-head {
      display: block;
      height: 60px;
      width: 60px;
      margin: 0 auto;
      line-height: 60px;
      border-radius: 100%;
      font-size:28px;
      color: #fff;
      text-align:center;
      background: #00a0e9;
  }

  .org-content {
      position: relative;
      padding: 0 0 1em 0;
      h1 {
          margin: 0;
          text-align: center;
          font-size:18px;
          font-weight: 600;
      }
  }

  .org-select {
      color: #00a0e9;
      font-size: 12px;
      margin-left: 0.4em;
  }

</style>