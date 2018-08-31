import axios from 'axios'
import Message from '@/components/common/message/index.js'
// import qs from "qs"
import router from '../../../router'

const Axios = axios.create({
  baseURL: window.VUE_APP_MOCK_URL || process.env.VUE_APP_MOCK_URL, // 反向代理
  timeout: 10000,
  // responseType: "json",
  // withCredentials: true, // 是否允许带cookie这些与Access-Control-Allow-Origin: * 不能同时设置为这样
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
})

// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    // if (config.method === "post") {
      // 序列化
      // config.data = qs.stringify(config.data)
      // 温馨提示,提交能直接接受json 格式,可以不用 qs 来序列化的
    // }

    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    if ( window.sessionStorage.loginUserBaseInfo && JSON.parse(window.sessionStorage.loginUserBaseInfo).token) {
      // config.headers.Authorization = sessionStorage.token
      config.headers.common['X-Auth-Token'] = JSON.parse(window.sessionStorage.loginUserBaseInfo).token
    }

    return config
  },
  error => {
    // Do something with request error
    Message({
      message: error,
      type: "error.data.error.message"
    })
    return Promise.reject(error.data.error.message)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    if(res.data.code == '999999' && window.sessionStorage.getItem("loginUserBaseInfo")){
      // let uerInfo = JSON.parse(window.sessionStorage.getItem("loginUserBaseInfo"))
      // this.post('/base/user/login',uerInfo)
      //   .then((res)=>{
      //     if(res.data.body.token){
      //       window.sessionStorage.setItem('loginUserBaseInfo',JSON.stringify(Object.assign(res.data.body, {lifeTime:60})))
      //       commit('setUserInfo', JSON.parse(window.sessionStorage.loginUserBaseInfo))
      //       return res
      //     }
      //   })
      //   .catch((res)=>{
      //     debugger
      //     console.log(res)
      //     return throw new Error(res)
      //   })
      router.push({
        path: "/login"
      })
    }
    if (res.data.code != '000000' && res.data.code != '100000' && res.data.code != '200000' && res.data.code != '300000') {
      Message({
        message: res.data.message,
        type: "error"
      })

      return Promise.reject(res)
    }
    return res
  },
  error => {
    // Do something with response error
    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
    // 直接丢sessionStorage或者sessionStorage
    if (!window.sessionStorage.getItem("loginUserBaseInfo")) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({
        path: "/login"
      });
    } else {
      // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
      // 返回去登录页重新登录
      // let lifeTime = JSON.parse(window.sessionStorage.getItem("loginUserBaseInfo")).lifeTime * 1000
      // let nowTime = new Date().getTime() // 当前时间的时间戳
      // console.log(nowTime, lifeTime)
      // console.log(nowTime > lifeTime)
      // if (nowTime > lifeTime) {
      //   Message({
      //     showClose: true,
      //     message: "登录状态信息过期,请重新登录",
      //     type: "error"
      //   });
      //   router.push({
      //     path: "/login"
      //   });
      // } else {
      //   // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
      //   if (error.response.status === 403) {
      //     router.push({
      //       path: "/error/403"
      //     })
      //   }
      //   if (error.response.status === 500) {
      //     router.push({
      //       path: "/error/500"
      //     })
      //   }
      //   if (error.response.status === 502) {
      //     router.push({
      //       path: "/error/502"
      //     })
      //   }
      //   if (error.response.status === 404) {
      //     router.push({
      //       path: "/error/404"
      //     })
      //   }
      // }
    }
    // 返回 response 里的错误信息
    let errorInfo =  error.response ? error.response.data : error.message
    Message({
      message: errorInfo,
      type: "error"
    })
    return Promise.reject(errorInfo)
  }
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  Axios,
  install: function(Vue, Option) {
    // 添加实例方法
    Object.defineProperty(Vue.prototype, "$http", { value: Axios })
  }
}
