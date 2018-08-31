<template>
  <div class="w-top5">
    <div class="w-top5__item" v-for="(item,index) in computedData" :key="index">
      <w-progress-bar
      :showpercent="showpercent"
      :height="itemHeight"
      :color="colorlist[index]"
      :percentage="item.percentage"
      :label="item.label"
      :text="item.text"></w-progress-bar>
    </div>
    <no-data v-if="!toplist || toplist.length == 0"></no-data>
  </div>
</template>
<script>
import WProgressBar from '@/components/common/WProgressBar.vue'
import NoData from '@/components/common/NoData.vue'
export default {
  data () {
    return {

    }
  },
  components: {
    WProgressBar,
    NoData
  },
  props: {
    itemHeight: {
      type: Number,
      default: 10,
      validator: val => val >= 0
    },
    showpercent: {
      type: Boolean,
      default: false
    },
    toplist: {
      type: Array,
      required: true
    },
    colorlist: {
      type: Array,
      default: () => ['#682D97', '#BBA0E8', '#F48071', '#94C52E', '#48BEFF']
    }
  },
  computed: {
    computedData: function () {
      while (this.toplist.length < 5 && this.toplist.length > 0) {
        this.toplist.push({
          label: '-',
          text: '-'
        })
      }

      return this.toplist
    }
  }
}
</script>
<style lang="scss" scoped>
  .w-top5{
    padding:1px 0;
    height: 230px;
  }
</style>
