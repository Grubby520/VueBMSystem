import Vue from 'vue'
import Vuex from 'vuex'
import xhr from './assets/js/components/xhr'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: null,
    menueList: [],
    crumbs: []
  },
  mutations: {
    setUserInfo (state, payload) { // 事件 commit 触发
      if (state.userInfo && (state.userInfo.userId !== payload.userId)) {
        return
      }
      if (state.isLogin) { // 已经登录
        return
      }
      state.userInfo = payload
      state.isLogin = true
      // window.sessionStorage.setItem('loginUserBaseInfo',JSON.stringify(Object.assign(state.userInfo, {lifeTime:60})))
    },
    // getUserInfo(){
    //   state.userInfo = JSON.parse(window.sessionStorage.getItem('loginUserBaseInfo'))
    // },
    setMenueList (state, payload) {
      state.menueList = payload
    },
    upDateMenueList (state, payload) {
      updateItem(state.menueList)
      function updateItem (arr) {
        if (payload.level > 1) {
          arr.forEach((item, index) => {
            if (item.isActive === true) {
              payload.level--
              updateItem(item.children)
            }
          })
          return
        }
        arr.forEach((item, index) => {
          if (item.id == payload.id) {
            item.isActive = true
            // _this.$set(state.menueList, index, item)
            arr.splice(index, 1, item)
          } else {
            item.isActive = false
            arr.splice(index, 1, item)
          }
        })
      }
    },
    initMenueList (state, payload) {
      initItem(state.menueList)
      // function initItem (arr) {
      //   arr.forEach((item, index) => {
      //     let url = /(.+)\/:/.exec(item.url) ? /(.+)\/:/.exec(item.url)[1] : item.url
      //     if (new RegExp(url).test(payload.path)) {
      //       item.isActive = true
      //       arr.splice(index, 1, item)
      //       if (item.children.length > 0) initItem(item.children)
      //     } else {
      //       item.isActive = false
      //       arr.splice(index, 1, item)
      //     }
      //   })
      // }
      function initItem (arr) {
        arr.forEach((item, index) => {
          const reg = new RegExp(payload.path.replace(/detail\/w*/, ''))
          if (item.url === payload.path) {
            item.isActive = true
            arr.splice(index, 1, item)
          } else if (payload.path.indexOf(item.url) === 0 && payload.path.charAt(item.url.length) === '/') {
            item.isActive = true
            arr.splice(index, 1, item)
            if (item.children.length > 0) initItem(item.children)
          } else {
            item.isActive = false
            arr.splice(index, 1, item)
          }
        })
      }
    },
    // setCrumbs (state, payload) {
    //   state.crumbs = payload
    // },
    logout (state) {
      state.userInfo = null
      state.isLogin = false
      window.sessionStorage.removeItem('loginUserBaseInfo')
    }
    // swtichRouter(state,router){//页面跳转
    //   let $_curMenuNode = $(".sidebar__menu").find("a[href*='"+router+"']"),
    //       level = $_curMenuNode.parent().attr("data-level"),
    //       $_1menuNode = $_curMenuNode.parents("li[data-level='1']").find('a').first(),
    //       $_2menuNode;
    //   switch(level){
    //     case '2':
    //       $_1menuNode[0].click();
    //       $_curMenuNode[0].click();
    //       break;
    //     // case '3':
    //     //   $_2menuNode = $_curMenuNode.parents("li[data-level='2']").find('a').first();
    //     //   $_1menuNode[0].click();
    //     //   $_2menuNode[0].click();
    //     //   $_curMenuNode[0].click();
    //     //   break;
    //     default:
    //       break;
    //   }

    // },
    // pageRefresh(state,router){
    //   let $_curMenuNode = $(".sidebar__menu").find("a[href*='"+router+"']"),
    //       level = $_curMenuNode.parent().attr("data-level"),
    //       $_1menuNode = $_curMenuNode.parents("li[data-level='1']").find('a').first(),
    //       $_2menuNode;
    //   switch(level){
    //     case '2':
    //       $_1menuNode[0].click();
    //       break;
    //     // case '3':
    //     //   $_2menuNode = $_curMenuNode.parents("li[data-level='2']").find('a').first();
    //     //   $_1menuNode[0].click();
    //     //   $_2menuNode.siblings('._3menu--slide').slideDown();
    //     //   $_2menuNode.find('.triangle-icon').addClass('open');
    //     //   $_2menuNode.addClass('active');
    //     //   $_curMenuNode.parent().addClass('active');
    //     //   break;
    //     default:
    //       break;
    //   }
    // }
  },
  actions: {
    getUserInfo ({commit, state}, params) {
      return xhr.Axios.post('/base/user/login', params)
        .then((res) => {
          if (res.data.body.token) {
            window.sessionStorage.setItem('loginUserBaseInfo', JSON.stringify(Object.assign(res.data.body, {lifeTime: 60})))
            commit('setUserInfo', JSON.parse(window.sessionStorage.loginUserBaseInfo))
            return res
          }
        })
        .catch((res) => {
          debugger
          console.log(res)
          throw new Error(res)
        })
    },
    getMenueList ({commit, state}, params) {
      let data = [
        {
          'id': '1',
          'parentId': null,
          'level': '1',
          'name': '互联网流量监管',
          'icon': 'iconfont icon-flow',
          'url': '/flow',
          'children': [
            {
              'id': '2',
              'parentId': '1',
              'level': '2',
              'name': '流量概览',
              'icon': 'iconfont icon-flow_overview-management',
              'url': '/flow/overview',
              'children': [

              ]
            },
            {
              'id': '3',
              'parentId': '1',
              'level': '2',
              'name': '流量分析',
              'icon': 'iconfont icon-flow_analyze-management',
              'url': '/flow/analyze',
              'children': [

              ]
            },
            {
              'id': '4',
              'parentId': '1',
              'level': '2',
              'name': '异常流量事件',
              'icon': 'iconfont icon-flow_event-management',
              'url': '/flow/event',
              'children': []
            },
            {
              'id': '5',
              'parentId': '1',
              'level': '2',
              'name': '流量报表',
              'icon': 'iconfont icon-flow_report-management',
              'url': '/flow/report',
              'children': []
            }
          ]
        }, {
          'id': '5',
          'parentId': null,
          'level': '1',
          'name': '资源监管',
          'icon': 'iconfont icon-resourceSupervision',
          'url': '/resource',
          'children': [
            {
              'id': '12',
              'parentId': '5',
              'level': '2',
              'name': '资源概览',
              'icon': 'iconfont icon-resouce_overview-management',
              'url': '/resource/overview',
              'children': []
            },
            {
              'id': '35',
              'parentId': '5',
              'level': '2',
              'name': '资源容量',
              'icon': 'iconfont icon-capacity_analysis-management',
              'url': '/resource/capacity',
              'children': []
            },
            {
              'id': '36',
              'parentId': '6',
              'level': '2',
              'name': '资源分配',
              'icon': 'iconfont icon-resource_allocation-management',
              'url': '/resource/distribution',
              'children': []
            },
            {
              'id': '37',
              'parentId': '7',
              'level': '2',
              'name': '资源负载',
              'icon': 'iconfont icon-resource_load-management',
              'url': '/resource/load',
              'children': []
            },
            {
              'id': '45',
              'parentId': '5',
              'level': '2',
              'name': '虚拟机资源配置',
              'icon': 'iconfont icon-appconfig_analysis-management',
              'url': '/resource/vm-config',
              'children': []
            },
            {
              'id': '45',
              'parentId': '5',
              'level': '2',
              'name': '容量分析',
              'icon': 'iconfont icon-appconfig_analysis-management',
              'url': '/resource/capacity-analyses',
              'children': []
            },
            {
              'id': '54',
              'parentId': '5',
              'level': '2',
              'name': '业务系统资源配置',
              'icon': 'iconfont icon-cloudHostConfig_analysis-management',
              'url': '/resource/business-config',
              'children': []
            }
          ]
        }, {
          'id': '2',
          'parentId': null,
          'level': '1',
          'name': '运维管理',
          'icon': 'iconfont icon-operationAdministration',
          'url': '/maintenance',
          'children': [
            {
              'id': '6',
              'parentId': '2',
              'level': '2',
              'name': '告警管理',
              'icon': 'iconfont icon-Notice-management',
              'url': '/maintenance/alarm',
              'children': [
                {
                  'id': '8',
                  'parentId': '6',
                  'level': '3',
                  'name': '告警事件',
                  'icon': '',
                  'url': '/maintenance/alarm/event',
                  'children': []
                }
              ]
            }
          ]
        }
      ]
      function formatData (arr) {
        arr.forEach((item) => {
          item.isActive = false
          if (item.children && item.children.length > 0) {
            formatData(item.children)
          }
        })
      }

      formatData(data)
      commit('setMenueList', data)
    }
  }
})
