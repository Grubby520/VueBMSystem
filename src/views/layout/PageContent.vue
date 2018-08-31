<template>
  <div class="page__content" v-init-screen-h="50">
    <slot></slot>
  </div>
</template>

<script>
export default {}
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
</style>
