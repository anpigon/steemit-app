import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main' // Main 컴포넌트 임포트

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})
