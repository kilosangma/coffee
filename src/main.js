import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'


import { Button, Form, Field, NavBar, Toast, Tabbar, TabbarItem, Swipe, SwipeItem, Lazyload, Icon, Stepper, GoodsAction, GoodsActionIcon, GoodsActionButton, SwipeCell, Empty, Checkbox, CheckboxGroup, SubmitBar, Dialog, AddressList, AddressEdit, Popup, Tab, Tabs,Uploader} from 'vant'
import 'lib-flexible'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(Button)
  .use(NavBar)
  .use(Field)
  .use(Form)
  .use(Toast)
  .use(VueAxios, axios)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Icon)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(SwipeCell)
  .use(Empty)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Dialog)
  .use(AddressList)
  .use(AddressEdit)
  .use(Popup)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
// 配置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
// 配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
//发起请求之前处理
axios.interceptors.request.use(config => {

  // 
  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }
    // 
    config.data = paramsString.slice(0, -1);
    // 
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
