<template>
  <div class="w-crumb--wrapper">
    <div class="w-crumb--substitute"></div>
    <div class="w-crumb" :class="themeClass">
      <el-breadcrumb :class="fixClass" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in crumbs" :key="index">
          <i class="w-crumb-icon" :class="item.iconClass" v-show="showIcon(index)"></i>{{item.name}}
        </el-breadcrumb-item>
      </el-breadcrumb>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import {BreadcrumbItem, Breadcrumb} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)

export default{
  data () {
    return {
      crumbs: []
    }
  },
  created () {
    this.setCrumbs(this.menueList)
  },
  watch: {
    '$route' () {
      this.crumbs = []
      this.setCrumbs(this.menueList)
    }
  },
  methods: {
    showIcon: function (index) { // 最后一个面包屑元素不显示
      return (this.crumbs.length > 1 && index != this.crumbs.length - 1) || this.crumbs.length == 1
    },
    setCrumbs: function (menueList) {
      let _this = this
      menueList.forEach((item) => {
        if (item.isActive == true) {
          _this.crumbs.push({
            iconClass: item.icon,
            name: item.name
          })
          if (item.children.length > 0) {
            _this.setCrumbs(item.children)
          }
        }
      })
    }
  },
  computed: {
    ...mapState([
      'menueList'
    ])
  },
  props: {
    fixClass: {
      type: String,
      default: 'el-breadcrumb--fix'
    },
    themeClass: {
      type: String,
      default: 'defaultTheme'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
  $crumbBgColor:#fff;
  $crumbSize:45px;
  $headerSize:50px;

  .w-crumb--substitute {
    height: $crumbSize;
  }

  .w-crumb-icon {
    font-size: 14px;
  }

  .w-crumb {
    position: fixed;
    z-index: 10;
    top:$headerSize;
    width: 100%;
    height: $crumbSize;
    line-height: $crumbSize;
    padding-left: 15px;

    &.defaultTheme {
      background:$crumbBgColor;
    }

    .el-breadcrumb--fix {
      display: inline-block;
      line-height: normal;
      vertical-align: middle;
      /deep/ .el-breadcrumb__inner {
        color: $text-color;
      }

      /deep/ .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        color: $color-primary;
      }
    }

    .w-crumb-icon {
      margin-right: 0.1em;
    }
  }
</style>
