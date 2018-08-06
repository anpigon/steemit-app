// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

// 작성일자 표시
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

// 명성 계산
Vue.filter('filterReputation', function (t) {
  if (!t) return t
  t = parseInt(t)
  let e = String(t)
  let r = e.charAt(0) === '-'
  e = r ? e.substring(1) : e
  let n = e
  let i = parseInt(n.substring(0, 4))
  let o = Math.log(i) / Math.log(10)
  let s = n.length - 1
  let a = s + (o - parseInt(o))
  if (isNaN(a)) a = 0
  else {
    a = Math.max(a - 9, 0)
    a *= r ? -1 : 1
    a = 9 * a + 25
    a = parseInt(a)
  }
  return a
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
