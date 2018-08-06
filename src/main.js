// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

Vue.filter('filterCreated', function (value) {
  if (!value) return ''
  const now = new Date()
  const created = new Date(value.toString() + 'Z')
  const elapsedSeconds = (now - created) / 1000 // 경과 시간(초)
  if (elapsedSeconds < 60) {
    return Math.round(elapsedSeconds) + '초 전'
  } else if (elapsedSeconds < 360) {
    return Math.round(elapsedSeconds / 60) + '분 전'
  } else if (elapsedSeconds < 8640) {
    return Math.round(elapsedSeconds / 60) + '시간 전'
  } else if (elapsedSeconds < 207360) {
    return '어제'
  } else {
    return (now.getFullYear() !== created.getFullYear() ? created.getFullYear() + '년 ' : '') +
                            (created.getMonth() + 1) + '월 ' +
                            created.getDate() + '일'
  }
})
