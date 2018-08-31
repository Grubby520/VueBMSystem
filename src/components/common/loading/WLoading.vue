<template>
  <div class="loading-box" >
    <div class="loading-inner">
      <div class="loading">
          <div class="loading-center">
              <div class="loading-center-absolute">
                  <div class="object object_one"></div>
                  <div class="object object_two"></div>
                  <div class="object object_three"></div>
                  <div class="object object_four"></div>
                  <div v-if="text">{{ text }}</div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        text:null,
        visiable:false
      }
    },
    methods:{
      close () {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
</script>
<style>
  #loading{
      background-color: rgb(231, 236, 240);
      height: 95vh;
      width: 100%;
      position: relative;
      z-index: 1;
      top: 0px;
  }
  .Table-list, .table-station{
      position: relative;
  }
  .loading-box{
      position: absolute;
      z-index: 99;
      background-color: rgba(255,255,255,.9);
      margin: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      -webkit-transition: opacity .3s;
      transition: opacity .3s;
  }
  .loading-inner{
      top: 50%;
      margin-top: -50px;
      width: 100%;
      text-align: center;
      position: absolute;
  }
  .loading{
      background: #fff;
      height: 100px;
      width: 100%;
      position: relative;
      z-index: 1;
  }
  #loading-center, .loading-center{
      width: 100%;
      height: 100%;
      position: relative;
  }
  #loading-center-absolute, .loading-center-absolute {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 60px;
      width: 60px;
      margin-top: -30px;
      margin-left: -30px;
      -webkit-animation: loading-center-absolute 1s infinite;
      animation: loading-center-absolute 1s infinite;
  }
  .object{
      width: 20px;
      height: 20px;
      background-color: #eee;
      float: left;
      -moz-border-radius: 50% 50% 50% 50%;
      -webkit-border-radius: 50% 50% 50% 50%;
      border-radius: 50% 50% 50% 50%;
      margin-right: 20px;
      margin-bottom: 20px;
  }
  .object:nth-child(2n+0) {
      margin-right: 0px;
  }
  #object_one, .object_one{
      -webkit-animation: object_one 1s infinite;
      animation: object_one 1s infinite;
  }
  #object_two, .object_two{
      -webkit-animation: object_two 1s infinite;
      animation: object_two 1s infinite;
  }
  #object_three, .object_three{
      -webkit-animation: object_three 1s infinite;
      animation: object_three 1s infinite;
  }
  #object_four, .object_four{
      -webkit-animation: object_four 1s infinite;
      animation: object_four 1s infinite;
  }
  @-webkit-keyframes loading-center-absolute{
      100% {
          -ms-transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }

  }
  @keyframes loading-center-absolute{
      100% {
          -ms-transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }
  @-webkit-keyframes object_one{
      50% {
          -ms-transform: translate(20px,20px);
          -webkit-transform: translate(20px,20px);
          transform: translate(20px,20px);
      }
  }
  @keyframes object_one{
      50% {
          -ms-transform: translate(20px,20px);
          -webkit-transform: translate(20px,20px);
          transform: translate(20px,20px);
      }
  }
  @-webkit-keyframes object_two{
      50% {
          -ms-transform: translate(-20px,20px);
          -webkit-transform: translate(-20px,20px);
          transform: translate(-20px,20px);
      }
  }
  @keyframes object_two{
      50% {
          -ms-transform: translate(-20px,20px);
          -webkit-transform: translate(-20px,20px);
          transform: translate(-20px,20px);
      }
  }
  @-webkit-keyframes object_three{
      50% {
          -ms-transform: translate(20px,-20px);
          -webkit-transform: translate(20px,-20px);
          transform: translate(20px,-20px);
      }
  }
  @keyframes object_three{
      50% {
          -ms-transform: translate(20px,-20px);
          -webkit-transform: translate(20px,-20px);
          transform: translate(20px,-20px);
      }
  }
  @-webkit-keyframes object_four{
      50% {
          -ms-transform: translate(-20px,-20px);
          -webkit-transform: translate(-20px,-20px);
          transform: translate(-20px,-20px);
      }
  }
  @keyframes object_four{
      50% {
          -ms-transform: translate(-20px,-20px);
          -webkit-transform: translate(-20px,-20px);
          transform: translate(-20px,-20px);
      }
  }
</style>