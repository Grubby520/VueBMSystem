<template>
  <div class="page__sidebar fl" v-init-screen-h="50">
    <ul class="menu__defaulTheme sidebar__menu">
      <li v-for="level1 in data" :data-level = 'level1.level' :class="level1.isActive?'active':''">
        <a v-if="level1.children && level1.children.length > 0"
          @click="expandMenue"
          :data-id="level1.id"
          :data-level = 'level1.level'
          :class="level1.isActive?'active':''">
          <i :class="level1.icon"></i>
        </a>
        <router-link v-else :to="level1.url"  exact active-class="active">
          <i :class="level1.icon"></i>
        </router-link>
        <div class="text-tip top">{{level1.name}}</div>
        <ul class="_2menu--slide" >
          <li class="menu--title">{{level1.name}}</li>
          <li v-for="level2 in level1.children" :data-level="level2.level" :class="level2.isActive?'active':''">
            <a v-if="level2.children && level2.children.length > 0"
              :data-level="level2.level"
              @click="expandMenue"
              :data-id="level2.id"
              :class="level2.isActive?'active':''">
              <i class="menu--icon" :class="level2.icon"></i>{{level2.name}}
              <img src="@/assets/image/sidebar/icon-down.png" class="triangle-icon show">
            </a>
            <router-link v-else :to="level2.url" exact active-class="active">
              <i class="menu--icon" :class="level2.icon"></i>{{level2.name}}
            </router-link>
            <ul  class="_3menu--slide">
              <li v-for="level3 in level2.children" :data-level="level3.level" >
                <router-link :to="level3.url" exact active-class="active"  @click="expandMenue">
                  <span >●</span>
                  {{level3.name}}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <!-- <li  data-level="1">
        <a  data-name="运维管理" class="active">
          <i class="iconfont icon-operationAdministration"></i>
        </a>
        <div  class="text-tip top">运维管理</div>
        <ul  class="_2menu--slide" style="display: block;">
          <li  class="menu--title">运维管理</li>
          <li  data-level="2">
            <a  data-name="告警管理">
              <i class="iconfont icon-Notice-management menu--icon"></i>
              告警管理
              <img src="" class="triangle-icon show">
            </a>
            <ul  class="_3menu--slide">
              <li  data-level="3"><span >●</span><a  href="#/monitor/alarm" class="">告警事件</a>
              </li>
            </ul>
          </li>
        </ul>
      </li> -->
    </ul>
  </div>
</template>
<script>

export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    this.$store.dispatch('getMenueList')
    this.data = this.$store.state.menueList
    this.$store.commit('initMenueList', this.$route)
  },
  computed: {
  },
  methods: {
    expandMenue (e) {
      e.stopPropagation()
      let _this = this
      let id = e.currentTarget.getAttribute('data-id')
      let level = e.currentTarget.getAttribute('data-level')
      this.$store.commit('upDateMenueList', {
        id,
        level
      })
    }
  },
  components: {

  }
}
</script>
<style lang="scss" scoped>
  /*scss采用BEM命令规范*/
  $sidebarBgColor:#25323e;
  $sidebarWidth:220px;
  .page__sidebar {
    position: fixed;
    width: $sidebarWidth;
    background: $sidebarBgColor;
  }

  $_1MenuHeight:45px;
  $_1MenuWidth:50px;
  $_2MenuH:45px;
  $_iconDefaultColor:#929ca4;
  $_blue:#2198f2;
  $_white:#fff;
  $_menuHoverBg:#2a3a49;
  $_2menuHoverBg:#2a3b48;
  $_3menuHoverBg:#2f404d;
  $_2MenuBg:#283640;
  $_3menuColor:#999;

  .text--center {
    text-align: center;
  }

  .menu__defaulTheme {
    li {
      a {
        color: $_iconDefaultColor;
      }
    }

  }

  .sidebar__menu {
    height: 100%;
    ._2menu--slide {
      position: fixed;
      top: 50px;
      left: 50px;
      display: none;
      background: $_2MenuBg;
      height: 100%;
      min-width: 170px;

      &.show {
        display: block;
      }

      .menu--title {
        padding: 0 0.5em 0 1.2em;
        height: $_2MenuH;
        line-height: $_2MenuH;
        color:$_iconDefaultColor;
        font-size: 16px;
      }
    }

    ._3menu--slide {
      display: none;
      &.show {
        display: block;
      }
    }

    li {
      &[data-level='1'].active ._2menu--slide, &[data-level='2'].active ._3menu--slide {
        display:block;
      }
      a {
        text-decoration: none;
        &.active img {
            transform: rotate(-90deg);
            transition:all 200ms;
        }
      }

      &:hover {
        cursor: pointer;
      }

      &[data-level='1'] > a {
        display: inline-block;
        height: $_1MenuHeight;
        width:$_1MenuWidth;
        line-height: $_1MenuHeight;
        @extend .text--center;

        &:hover {
          background-color: $_menuHoverBg;
          color: $_white;
          @at-root & + .text-tip {
            display: block;
          }
        }

        &.active {
          background-color:$_blue;
          color: $_white;
        }
      }

      &[data-level='2'] > a {
        display: inline-block;
        height: $_2MenuH;
        width: 100%;
        padding: 0 0.5em 0 1.2em;
        line-height: $_2MenuH;
        box-sizing: border-box;

        &:hover,
        &.active,
        &.router-link-active {
          background: $_2menuHoverBg;
          color: $_white;
        }

        /deep/ .menu--icon {
          margin-right:0.5em;
        }
      }

      &[data-level='3'] >a {
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        padding: 1em 0.5em 1em 3em;
        color:$_3menuColor;

        span {
          margin-right: 0.5em;
        }

        &:hover,
        &.active,
        &.router-link-active {
          color:$_white;
          background: $_3menuHoverBg;
          a {
            color:$_white;
          }
        }
      }
    }

    /deep/ .triangle-icon {
      display: none;
      float: right;
      margin-top:22px;
      margin-left:0.5em;
      transition:all 200ms;
      &.show {
        display: inline;
      }

      // &.open {
      //   transform: rotate(-90deg);
      //   transition:all 200ms;
      // }
    }

  }

  /*text-tip*/
  .text-tip {
    position:absolute;
    left: 5px;
    width: 40px;
    padding: 0.1em;
    display: none;
    box-sizing: border-box;
    border-radius: 0.2em;
    text-align:center;
    font-size: 12px;
    background:$_white;

    &::before {
      position:absolute;
      top:0;
      left:50%;
      margin-left:-5px;
      content:'';
      border:5px solid $_white;
    }

    &.top::before {
      top:-10px;
      border-color:transparent transparent $_white transparent;
    }
  }

</style>
