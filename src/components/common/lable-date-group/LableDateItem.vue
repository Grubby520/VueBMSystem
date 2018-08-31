<template>
  <a @click="clickHandler" :index="index" :type="type" href="javascript:;" :class="[active?'active':'']"><slot></slot></a>
</template>
<script>
export default{
  props: ['type', 'index'],
  data () {
    return {
    }
  },
  computed: {
    active () {
      return this.$parent.curIndex == this.index
    }
  },
  methods: {
    clickHandler (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
