import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { menuModules } from './menustore/menuModules'
import { shopcartModules } from './shopcarstore/shopcartModules'
export default new Vuex.Store({
  modules: {
    menuModules,
    shopcartModules
  },
  state: {
    name: "mainName",
    token: ""
  },
  mutations: {
    subToken(state, tk) {
      state.token = tk
    },
    clearToken(state) {
      
      
      state.token = ''
    }
  }
})
