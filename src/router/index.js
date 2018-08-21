import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main' // Main 컴포넌트 임포트
import PostView from '@/components/PostView' // PostView 컴포넌트 임포트
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   alias: ['/trending', '/created', '/hot'],
    //   name: 'Main',
    //   component: Main
    // },
    // {
    //   path: '/@:author/feed', redirect: { name: 'Main' }
    //   // name: 'Main',
    //   // component: Main
    // },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        { name: 'Feed', path: '/@:author/feed', component: Main, meta: { main: true } },
        { name: 'Discussions', path: 'default', component: Main, alias: ['/trending', '/created', '/hot'], meta: { main: true } }
      ]
    },
    {
      path: '/@:author/:permlink',
      // alias: '/:category/@:author/:permlink',
      name: 'PostView',
      component: PostView,
      props: true
    },
    {
      path: '/@:author/:permlink/vote',
      // alias: '/:category/@:author/:permlink/vote',
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
