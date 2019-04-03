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
import JsBridge from '@/JS/JSBridge.js'
import { getRefreshToken } from "@/api/api.js";
// 引用公共JS
import commonJS from '@/JS/commonJS.js'
Vue.prototype.$commonJS = commonJS;
import qs from 'qs'
import md5 from 'js-md5'
import { locale } from 'core-js';
Vue.prototype.$md5 = md5;
Vue.prototype.$axios = axios;// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.$qs = qs;
Vue.use(JsBridge)
Vue.use(Mint);
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(echarts);
Vue.use(vant)
Vue.config.productionTip = false

/* eslint-disable no-new */
// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.log(error)
      console.log(error.response)
      console.log(error.response.status)
      switch (error.response.status) {
        case 401:
          getRefreshToken()
          break;
        case 400:
          getRefreshToken()
          break;
          case 404:
          Toast('无法访问')
          break;
          // 通过状态码判断token是否失效或者token是否错误，若是，直接返回登录页面
        /*   localStorage.clear(), //清空localStorage
          router.push({
            path: '/login',
          }) */
      }
    }
    return Promise.reject(error)
  })

//全局守卫，记录登录状态
router.beforeEach((to, from, next) => {
  //需求登录判断
  if (to.meta.required) {
    //未登录
    var isLogin = JSON.parse(window.localStorage.getItem('token'));
    console.log(isLogin)
    if (isLogin != '') {
      next();//跳转到目标页面
    } else if (isLogin == null || isLogin == undefined || isLogin == '') {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });//跳转到登录页面
      Toast('请先登录');

    }
  } else {
    next();
  }
})
export default axios
new Vue({
  el: '#app',
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
