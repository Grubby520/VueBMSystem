<script>
import Vue from 'vue'
import iconDown from '@/assets/image/sidebar/icon-down.png'
require('@/assets/js/lib/jquery-3.1.1.min.js')

Vue.component('text-tip', {
  name: 'TextTip',
  render: function (createElement) {
    return createElement(
      'div',
      {
        class: {
          'text-tip': true,
          [this.position]: true
        }
      },
      this.$slots.default
    )
  },
  props: {
    position: {
      type: String,
      default: 'top'
    }
  }
})

/* 一级菜单 */
Vue.component('first-menu', {
  name: 'FirstMenu',
  render: function (createElement) {
    let label = this.hasChild ? 'a' : 'router-link',
      name = this.name,
      url = this.url,
      iconClass = this.iconClass,
      props = {},
      vm = this

    if (!this.hasChild) {
      props.to = url
    }

    return createElement(
      label,
      {
        attrs: {
          'data-name': name
        },
        props: props,
        on: {
          click: function (e) {
            vm.menuClick(e)
          }
        },
        nativeOn: {// 无子组件
          click: function (e) {
            vm.menuClick(e)
          }
        }
      },
      [
        createElement('i', {
          class: {
            [iconClass]: true
          }
        })
      ]
    )
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    hasChild: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    menuClick: function (e) {
      let eleDom, $eleDom
      if (e.target.localName == 'i') {
        eleDom = e.target.parentNode
      } else {
        eleDom = e.target
      }
      $eleDom = $(eleDom)

      $eleDom.parent().siblings().find('li[data-level=\'2\']').children('a')
        .removeClass('active')
        .children('.triangle-icon')
        .removeClass('open')
        .end()
        .siblings('._3menu--slide')
        .slideUp()
        .children('li')
        .removeClass('active')

      $eleDom.parent().siblings().find('a')
        .removeClass('active')
        .siblings('._2menu--slide')
        .hide()

      $eleDom.siblings('._2menu--slide').slideDown()
      $eleDom.addClass('active')
    }
  }
})

/* 二级菜单 */
Vue.component('second-menu', {
  name: 'SecondMenu',
  render: function (createElement) {
    let hasChild = this.hasChild,
      label = hasChild ? 'a' : 'router-link',
      name = this.name,
      url = this.url,
      iconClass = this.iconClass,
      props = {},
      vm = this

    if (!this.hasChild) {
      props.to = url
    }

    return createElement(
      label,
      {
        attrs: {
          'data-name': name
        },
        props: props,
        nativeOn: {// 无子组件
          click: function (e) {
            vm.menuClick(e)
          }
        },
        on: {// 有子组件
          click: function (e) {
            vm.menuClick(e)
          }
        }
      },
      [
        createElement('i', {
          class: {
            [iconClass]: true,
            'menu--icon': true
          }
        }),
        name,
        createElement('img', {
          attrs: {
            src: iconDown
          },
          class: {
            'triangle-icon': true,
            show: hasChild
          }
        })
      ])
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    hasChild: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    menuClick: function (e) {
      e.preventDefault()

      let eleDom = e.target,
        $eleDom = $(eleDom)
      $eleDom.parent().siblings()
        .find('a')
        .find('.triangle-icon')
        .removeClass('open')
        .end()
        .removeClass('active')
        .siblings('._3menu--slide')
        .slideUp()
        .find('li')
        .removeClass('active')

      $eleDom.siblings('._3menu--slide').slideToggle()
      $eleDom.toggleClass('active')

      $eleDom.find('.triangle-icon').toggleClass('open')
    }
  }
})

/* 三级菜单 */
Vue.component('third-menu', {
  name: 'ThirdMenu',
  render: function (createElement) {
    let name = this.name,
      url = this.url,
      vm = this

    return createElement(
      'router-link',
      {
        props: {
          to: url
        },
        nativeOn: {// 无子组件
          click: function (e) {
            vm.menuClick(e)
          }
        }
      },
      [name]
    )
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    menuClick: function (e) {
      e.preventDefault();
      let eleDom = e.target
      $(eleDom).parent()
        .siblings()
        .removeClass('active')
        .end()
        .addClass('active')
    }
  }
})

function createMenu (createElement, data, opt) {
  let createMenuVnodes = function (createElement, data) {
    if (Array.isArray(data)) {
      return data.map(function (ele, index, arr) {
        let map,
          hasChild = ele.chidren.length > 0,
          chidren = []

        switch (ele.level) {
          case '1':
            chidren = [
              createElement('first-menu', {
                props: {
                  name: ele.name,
                  iconClass: ele.icon,
                  url: ele.url,
                  hasChild: hasChild
                }
              }),
              createElement('text-tip', ele.name)
            ]

            if (hasChild) {
              chidren.push(
                createElement(
                  'ul',
                  {
                    class: {
                      '_2menu--slide': true
                    }
                  },
                  [
                    createElement('li', {
                      class: {
                        'menu--title': true
                      }
                    }, [ele.name]),
                    createMenuVnodes(createElement, ele.chidren)
                  ])
              )
            }

            break
          case '2':
            chidren = [
              createElement('second-menu', {
                props: {
                  name: ele.name,
                  iconClass: ele.icon,
                  url: ele.url,
                  hasChild: hasChild
                }
              })
            ]

            if (hasChild) {
              chidren.push(
                createElement('ul',
                  {
                    class: {
                      '_3menu--slide': true
                    }
                  },
                  [createMenuVnodes(createElement, ele.chidren)]
                )
              )
            }

            break
          case '3':
            chidren = [
              createElement('span', '●'),
              createElement('third-menu', {
                props: {
                  name: ele.name,
                  url: ele.url
                }
              }
              )
            ]

            break
        }

        return createElement(
          'li',
          {
            attrs: {
              'data-level': ele.level// 必须,scss样式选择器会用
            }
          },
          chidren
        )
      })
    } else {
      return []
    }
  }

  return createElement(
    'ul', opt,
    createMenuVnodes(createElement, data)
  )
}

export default {
  name: 'NavMenu',
  render: function (createElement) {
    let that = this
    let opt = {
      class: {
        'menu__defaulTheme': true,
        'sidebar__menu': true
      }
    }
    return createMenu(createElement, this.data, opt)
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted: function () {
    let firstMenu = $('li[data-level="1"]').first().children('a'),
        secondMenu,
        thirdMenu;
    secondMenu = firstMenu.siblings('._2menu--slide').children("li[data-level='2']").first().children('a');
    thirdMenu = secondMenu.siblings('._3menu--slide').find('li');
    firstMenu[0].click();
    if (thirdMenu.length > 0) {
      secondMenu[0].click();
      thirdMenu.first().find('a')[0].click();
    }
  }
}
</script>

<style lang="scss" scoped>
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
      a {
        text-decoration: none;
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

      &[data-level='3'] {
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

      &.open {
        transform: rotate(-90deg);
        transition:all 200ms;
      }
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
