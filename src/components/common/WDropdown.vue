<template>
    <div class="vue-dropdown" :class="themestyle" v-show-extend="show">
        <div class="search-module clearfix" v-show="itemlist.length">
            <input class="search-text" @keyup='search($event)' :placeholder="placeholder" />
            <span class="pageIconFont icon-search search-icon"></span>
        </div>
        <div :style="{height:height+'px'}" style="overflow:hidden;" v-show="length">
          <el-scrollbar style="height:100%;" wrapStyle="overflow-x: hidden;">
            <ul class="list-module">
                <li v-for ="(item,index) in datalist" @click="appClick(item)" :key="index">
                    <span class="list-item-text">{{item.name}}</span>
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
      datalist: []
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
    height: {
      type: Number,
      default: 200
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
    appClick: function (data) {
      this.$emit('item-click', data)
    },
    search: function (e) {
      let vm = this, searchvalue = e.currentTarget.value
      vm.datalist = vm.itemlist.filter(function (item, index, arr) {
        return item.name.indexOf(searchvalue) != -1
      })
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
    .vue-dropdown.default-theme {
        position: absolute;
        left:15%;
        display: none;
        width: 70%;
        margin: 0 auto;
        margin-top: 1em;
        padding: 1em;
        background: #fff;
        z-index:10;
        box-shadow: 0px 0px 10px #ccc;
        &._self-show {
            display: block!important;
        }

        .search-module {
            position: relative;
            .search-text {
                width: 100%;
                height: 30px;
                padding-right: 2em;
                padding-left:0.5em;
                border-radius: 0.5em;
                box-shadow: none;
                border: 1px solid #ccc;
                box-sizing: border-box;
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
            //max-height: 200px;
            //overflow-y: auto;
            li {
                &._self-hide {
                    display: none;
                }
                margin-top: 0.5em;
                padding: 0.5em;
                &:hover {
                    cursor:pointer;
                    color: #fff;
                    background: #00a0e9;

                }
            }
        }
    }
    .tip__nodata {
        font-size: 12px;
        margin-top: 1em;
    }
</style>
