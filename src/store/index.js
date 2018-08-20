import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import global from './modules/global'
import account from './modules/account'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    account,
    auth
  }
})
