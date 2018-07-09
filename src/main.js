// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

axios.defaults.headers = {
  lang: 'cn',
  legalTende: 1,
  applicationId: 2,
  applicationClientType: 1,
}
Vue.prototype.$axios = axios

new Vue({
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')
