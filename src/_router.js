import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import xhr from './assets/js/components/xhr'
import Message from '@/components/common/message/index.js'

import About from './views/About.vue'

const Doc = () => import('./views/Doc.vue')
const Login = () => import('./views/login/Login.vue')
// const Main = () => import('./views/layout/Main.vue')
const Main = () => import('./views/layout/_Main.vue')
// const FlowEvent = () => import('./views/flow/FlowEvent.vue')
const FlowEvent = () => import('./views/flow/_FlowEvent.vue')
const FlowReport = () => import('./views/flow/FlowReport.vue')
const FlowOverview = () => import('./views/flow/FlowOverview.vue')
const FlowAnalyze = () => import('./views/flow/FlowAnalyze.vue')
const FlowAnalyzeDetail = () => import('./views/flow/FlowAnalyzeDetail.vue')
const ResourceCapacityAnalyses = () => import('./views/resource/ResourceCapacityAnalyses.vue')
const ResourceVmConfig = () => import('./views/resource/ResourceVmConfig.vue')
const ResourceOverview = () => import('./views/resource/ResourceOverview.vue')
const ResourceCapacity = () => import('./views/resource/ResourceCapacity.vue')
const ResourceLoad = () => import('./views/resource/ResourceLoad.vue')
const ResourceDistribution = () => import('./views/resource/ResourceDistribution.vue')
const ResourceBusinessConfig = () => import('./views/resource/ResourceBusinessConfig.vue')
const MaintenanceAlarmEvent = () => import('./views/maintenance/alarm/MaintenanceAlarmEvent.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Main,
      meta: { requiresAuth: true },
      // beforeEnter: (to, from, next) => {
      //   debugger
      //   store.commit('initMenueList', to)
      // },
      children: [
        {
          path: 'flow',
          name: 'flowOverview',
          component: FlowOverview
        },
        {
          path: 'flow/overview',
          name: 'flowOverview',
          component: FlowOverview
        },
        {
          path: 'flow/analyze',
          name: 'flowAnalyze',
          component: FlowAnalyze
        },
        {
          path: 'flow/analyze/detail/:orgId?',
          name: 'flowAnalyzeDetail',
          component: FlowAnalyzeDetail
        },
        {
          path: 'flow/event',
          name: 'flow_event',
          component: FlowEvent
        },
        {
          path: 'flow/report',
          name: 'flow_report',
          component: FlowReport
        },
        {
          path: 'resource/overview',
          name: 'resource_overview',
          component: ResourceOverview
        },
        {
          path: 'resource/capacity',
          name: 'resource_capacity',
          component: ResourceCapacity
        },
        {
          path: 'resource/load',
          name: 'resource_load',
          component: ResourceLoad
        },
        {
          path: 'resource/distribution',
          name: 'resource_distribution',
          component: ResourceDistribution
        },
        {
          path: 'resource/capacity-analyses',
          name: 'resource_capacity-analyses',
          component: ResourceCapacityAnalyses
        },
        {
          path: 'resource/vm-config',
          name: 'resource_vm-config',
          component: ResourceVmConfig
        },
        {
          path: 'resource/business-config',
          name: 'resource_business-config',
          component: ResourceBusinessConfig
        },
        {
          path: 'maintenance/alarm/event',
          name: 'alarm',
          component: MaintenanceAlarmEvent
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/doc',
      name: 'doc',
      component: Doc
    }
  ]
})

// 路由拦截
// 不是所有版块都需要鉴权的
// 所以需要鉴权,requiresAuth,设置为true的时候
// 必须走鉴权,像登录页这些不要,是可以直接访问的
router.beforeEach((to, from, next) => {
  if (to.matched.some(item => item.meta.requiresAuth)) {
    // 判断是否需要登录权限
    if (window.sessionStorage.getItem('loginUserBaseInfo')) {
      // 判断是否登录
      // let lifeTime =
      //   JSON.parse(window.sessionStorage.getItem("loginUserBaseInfo")).lifeTime *
      //   1000;
      // let nowTime = (new Date()).getTime(); // 当前时间的时间戳
      // if (nowTime < lifeTime) {
      //   next();
      // } else {
      //   Message({
      //     showClose: true,
      //     message: "登录状态信息过期,请重新登录",
      //     type: "error"
      //   });
      //   next({
      //     path: "/login",
      //     query: { redirect: to.fullPath } // 登录成功之后可以根据query中的内容跳转回原来的路由(页面)
      //   });
      // }
      next()
    } else {
      if (/token=(.+)/.exec(window.location.href)) {
        let token = /token=(.+)/.exec(window.location.href)[1]
        window.sessionStorage.setItem('loginUserBaseInfo', JSON.stringify({'token': token}))
        xhr.Axios.get('/base/user/loginUserInfo')
          .then((res) => {
            console.log(res)
            window.sessionStorage.setItem('loginUserBaseInfo', JSON.stringify({'token': 'eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNosjUEKwyAQAP-yZxXXqGu99Rho6RtisymCJCHGXkr_Xg-9DcPAfKC2BBFAQKt8jHPnoLV_LjRLbTBIRCaZrJuks8SUmAdvXe9zfey83ls5M8RlKpUFHFvhG7-5QEQBZXvl9Xp2doO9hEA6GBv-ftz7CskoJGWMU17D9wcAAP__.Irw2q7f_Fbnb4wBb3Fj_RfZgXFqd-JW5nD8DIqWbeco', 'userId': '8006cf7d-0218-11e7-b45a-547e7bee3645', 'username': 'super_admin', 'realName': 'super_admin', 'isOpenMulti': false, 'roleLevel': 1}))
            store.commit('setUserInfo', JSON.parse(window.sessionStorage.loginUserBaseInfo))
          })
        next()
      } else {
        // 没登录则跳转到登录界面
        next({
          path: '/login'
        })
      }
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (to.matched.some(item => item.meta.requiresAuth)) {
    store.commit('initMenueList', to)
  }
})
export default router
