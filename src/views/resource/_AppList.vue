<template>
  <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
    <div class="nav-logo"><span class="pageIconFont icon-organization"></span></div>
    <div class="nav-content">
      <h1 class="page-portrait" id="chooseBtn">
        {{orgName}}
      </h1>
      <div class="applist__container">
        <w-dropdown-ext style="margin-top:1em;"
        @item-click="itemClickHandle"
        :show="true"
        :itemlist="list"
        :placeholder="placeholder"
        nodatatext="没找到业务系统"
        :add-icon="true"
        :has-status="true"
        icon-class="pageIconFont icon-webpage"
        status-icon-type="text"
        :item-text-style="{width:'75%'}"></w-dropdown-ext>
      </div>

    </div>
  </div>
</template>
<script>

  import WDropdown from '@/components/common/WDropdown.vue'
  import WDropdownExt from '@/components/common/WDropdownExt.vue'
  export default {
    props:{
      list:Array,
      placeholder:String,
      orgName:String
    },
    data(){
      return{}
    },
    methods:{
      itemClickHandle(data, event){
        if (event.target.localName == 'li') {
          $(event.target).siblings().removeClass('active')
            .end().addClass('active')
        } else if (event.target.localName == 'span') {
          $(event.target).parent().siblings().removeClass('active')
            .end().addClass('active')
        }
        this.$emit('click',data, event)
      }
    },
    components:{
        WDropdown,
        WDropdownExt
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