const state = {
  username: window.sessionStorage.getItem('username') || '',
  password: window.sessionStorage.getItem('password') || ''
}

const getters = {
}

const actions = {
  login ({ commit }, auth) {
    commit('login', auth)
    window.sessionStorage.setItem('username', auth.username)
    window.sessionStorage.setItem('password', auth.password)
  }
}

const mutations = {
  login (state, { username, password }) {
    state.username = username
    state.password = password
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
