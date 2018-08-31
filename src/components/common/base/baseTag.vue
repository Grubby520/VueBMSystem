<!-- 可点击的标签 -->
<template>
  <button class="Btn-default"><slot></slot></button>
</template>
<script>
export default {
  props: {
    type: String
  }
}
</script>
