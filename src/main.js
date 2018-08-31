import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import xhr from './assets/js/components/xhr'
import Loading from './components/common/loading/directive'
import InitScreenH from '@/components/directives/InitScreenH'

Vue.use(InitScreenH)
Vue.use(xhr)
Vue.use(Loading)

console.log('>项目:' + process.argv.splice(2))
console.log('>process.argv:' + JSON.stringify(process.argv))
console.log('>url:' + process.env.VUE_APP_MOCK_URL)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
