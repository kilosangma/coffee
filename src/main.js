import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Button, Form, Field, NavBar,Toast } from 'vant'
import 'lib-flexible'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(Button)
  .use(NavBar)
  .use(Field)
  .use(Form)
  .use(Toast)
Vue.use(VueAxios, axios)

// 配置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
// 配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
//发起请求之前处理
axios.interceptors.request.use(config => {
  
  console.log('config ==> ', config);
  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }
    // console.log('paramsString ==> ', paramsString);
    config.data = paramsString.slice(0, -1);
    // console.log('config.data ==> ', config.data);
  }
  return config;
})
//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
