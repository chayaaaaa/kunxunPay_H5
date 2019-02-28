import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Vuex from 'vuex' //引入状态管理
import router from './router'
import Mint from 'mint-ui'
import ElementUI from 'element-ui'
import { Toast } from 'mint-ui'
import vant from 'vant'
import echarts from "echarts"
import 'vant/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'mint-ui/lib/style.css'
import 'lib-flexible'
import '@/CSSFILE/common.css'
import qs from 'qs'
import md5 from 'js-md5'
Vue.prototype.$md5 = md5;
Vue.prototype.$axios = axios;// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.$qs = qs;
Vue.use(Mint);
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(echarts);
Vue.use(vant)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
