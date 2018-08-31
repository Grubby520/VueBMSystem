<template>
  <page-content>
    <w-crumb :crumbs="crumbs"></w-crumb>
    <content-container><slot></slot></content-container>
  </page-content>
</template>

<script>
import WCrumb from '@/components/common/WCrumb.vue'
import PageContent from '@/views/layout/PageContent.vue'
import ContentContainer from '@/views/layout/ContentContainer.vue'
export default {
  components: {
    WCrumb,
    PageContent,
    ContentContainer
  },
  props: {
    crumbs: {
      type: Array,
      required: true,
      default: function () {
        return [{
          iconClass: '',
          name: ''
        }]
      }
    }
  }
}
</script>
