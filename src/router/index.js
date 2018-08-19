import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main' // Main 컴포넌트 임포트
import PostView from '@/components/PostView' // PostView 컴포넌트 임포트
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/@:author/:permlink',
      alias: '/category/@:author/:permlink',
      name: 'PostView',
      component: PostView
    },
    {
      path: '/@:author/:permlink/vote',
      alias: '/category/@:author/:permlink/vote',
      name: 'VoteHistory',
      component: () => import('@/components/VoteHistory')
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    { path: '*', name: 'NotFound', component: { template: '<div>Not Found</div>' } }
  ]
})
