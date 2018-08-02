import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main' // Main 컴포넌트 임포트
import Detail from '@/components/Detail' // Detail 컴포넌트 임포트

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/detail/:author/:permlink',
      name: 'Detail',
      component: Detail
    }
  ]
})
