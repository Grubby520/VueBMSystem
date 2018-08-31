<template>
  <h1 class="page__title"><span><slot></slot></span></h1>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
  .page__title {
    position: relative;
    margin: 0;
    height: 45px;
    line-height: 45px;
    background-color: #fff;
    font-size: 14px;
    font-weight: bolder;

    & > span {
      display: inline-block;
      vertical-align: middle;
    }

    & > span:before {
      content: '';
      display: inline-block;
      height: 1em;
      width: 4px;
      margin-right: 0.2em;
      vertical-align: middle;
      background: #00a0e9;
    }

  }
</style>
