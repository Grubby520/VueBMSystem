<template>
    <div class="vue-dropdown-ext" :class="themestyle" v-show-extend="show">
        <div class="search-module clearfix" v-show="itemlist.length">
            <input class="search-text" @keyup='search($event)' :placeholder="placeholder" />
            <span class="pageIconFont icon-search search-icon"></span>
        </div>
        <div style="overflow:hidden;" :style="{height:maxH+'px'}" v-show="length">
          <el-scrollbar style="height:100%;" wrapStyle="overflow-x: hidden;">
            <ul class="list-module">
                <li v-for ="(item,index) in datalist" @click="appClick(item,$event)" :key="index" :title="item.name">
                    <span v-if="addIcon" :class="iconClass"></span>
                    <span class="list-item-text text-overflow__style" :style="itemTextStyle">
                      {{item.name}}<span v-if='item.errorClass' class="pageIconFont" :class='item.errorClass'></span>
                    </span>
                    <span v-if="statusIconType == 'text' && hasStatus" :class="item.statusClass">{{item.statusText}}</span>
                    <span v-if="statusIconType == 'icon' && hasStatus" :class="item.statusClass"></span>
                </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="tip__nodata" v-show="!length">{{nodatatext}}</div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      datalist: this.itemlist.concat()
    }
  },
  props: {
    'show': {// 用于外部控制组件的显示/隐藏
      type: Boolean,
      default: true
    },
    'itemlist': Array,
    'placeholder': String,
    'nodatatext': String,
    'themestyle': {
      type: String,
      default: 'default-theme'
    },
    'item-text-style': {
      type: Object,
      default: function () {
        return {
          width: '80%'
        }
      }
    },
    'add-icon': {
      type: Boolean,
      default: true
    },
    'icon-class': {
      type: String,
      default: ''
    },
    'has-status': {
      type: Boolean,
      default: false
    },
    'status-icon-type': {
      type: String,
      default: 'text'// text or icon
    },
    'max-h': {
      type: Number,
      default: $(window).height() - 400
    }
  },
  watch: {
    itemlist: function (val) {
      this.datalist = val.concat()
    }
  },
  directives: {
    'show-extend': function (el, binding, vnode) { // bind和 update钩子
      let value = binding.value, searchInput = null
      if (value) {
        el.style.display = 'block'
      } else { // 隐藏后，恢复初始状态
        el.style.display = 'none'
        searchInput = el.querySelector('.search-text')
        searchInput.value = ''
        vnode.context.datalist = vnode.context.itemlist// 还原渲染数据
      }
    }
  },
  methods: {
    appClick: function (data, event) {
      this.$emit('item-click', data, event)
    },
    search: function (e) {
      let vm = this, searchvalue = e.currentTarget.value
      vm.datalist = vm.itemlist.filter(function (item, index, arr) {
        return item.name.indexOf(searchvalue) != -1
      })
    },
    statusIconClass: function (status) {
      let statusClass = ''
      return statusClass
    }
  },
  computed: {
    length: function () {
      return this.datalist.length
    }
  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
    .text-overflow__style {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .idle {
      color: $color-danger
    }
    .busy {
      color: $color-danger
    }
    .vue-dropdown-ext {

      .search-module {
          position: relative;
          .search-text {
              width: 100%;
              height: 30px;
              padding-right: 2em;
              padding-left:0.5em;
              box-shadow: none;
              box-sizing: border-box;
              border: 1px solid #ccc;
              background: #fff;
              &:focus {
                border-color: #2198f2;
              }
          }

          .search-icon {
            position: absolute;
            top: 10%;
            right: 0.5em;
            color: #aaa;
          }

      }

      .list-module {
        //overflow: auto;
        li {
          position: relative;
          margin-top: 0.5em;
          padding: 0.5em;
          border: 1px solid #ccc;
          white-space: nowrap;
          font-size: 12px;
          &>span {
              display: inline-block;
              vertical-align: middle;
          }

        }
      }

      .tip__nodata {
        font-size: 12px;
        margin-top: 1em;
      }

      &.default-theme {
        .list-module li {
          &:hover {
              cursor: pointer;
              border-color: #00a0e9;
          }

          &.active {
              border-color: #00a0e9;
              color: #00a0e9;
          }
        }
      }
    }
</style>
