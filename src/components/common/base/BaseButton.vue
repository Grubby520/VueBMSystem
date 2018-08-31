<template>
  <button v-cloak class="Btn" type="button"
    @click="handleClick"
    :disabled="buttonDisabled"
    :class="[
      type ? 'Btn-'+type : '', size ? 'Btn-'+size:'',
      {'active':isActive,'Btn-radius':isRadius},
    ]"
    >
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: '',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    // setActive: { // 是否可选中
    //   type: Boolean,
    //   default: false
    // },
    active: {
      type: Boolean,
      default: false
    },
    isRadius: {
      type: Boolean,
      default: false
    },
    buttonDisabled: {
      type: Boolean,
      default: false
    },
    size: String
  },
  data () {
    return {
      isActive: this.active
    }
  },
  computed: {

  },
  mounted(){
    console.log(this.$el.attributes['label'])
    console.log('~~~~~~~'+this.$el)
  },
  methods: {
    handleClick (evt) {
      // if(this.active) this.isActive = !this.isActive
      this.$emit('click', evt)
    }
  }
}
</script>
