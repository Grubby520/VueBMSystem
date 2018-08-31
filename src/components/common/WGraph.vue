<template>
    <div class="graph-box">
        <div class="graph-title">
          <!-- 标题-->
          <slot name="title"></slot>
          <slot class="info" name="info"></slot>
          <!-- <div class="fr">
              <a class="trend graph-nav active" href="javascript:;">近7日</a>|
              <a class="trend graph-nav" href="javascript:;">近30日</a>|
              <a class="trend graph-nav" href="javascript:;">近60日</a>
          </div> -->
        </div>
        <slot class="graph-content" name="content" v-Wloading="isLoading"></slot>
    </div>
</template>
<script>
export default {
  props:{
    isLoading:false
  },
}
</script>
