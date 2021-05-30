import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

Vue.config.productionTip = false

// 设置全局变量
import global_ from './views/Base.vue'

Vue.prototype.GLOBAL = global_;
axios.defaults.baseURL = global_.BASE_URL;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
