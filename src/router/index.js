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
        // { path: 'default', redirect: { name: 'Created' } },
        { path: 'default', redirect: { name: 'Created' }, alias: '' },
        { name: 'Feed', path: '/@:username/feed', component: () => import('@/components/panels/FeedPanel'), meta: { main: true }, props: true },
        { name: 'Created', path: '/created', component: () => import('@/components/panels/CreatedPanel'), meta: { main: true } },
        { name: 'Hot', path: '/hot', component: () => import('@/components/panels/HotPanel'), meta: { main: true } },
        { name: 'Trending', path: '/trending', component: () => import('@/components/panels/TrendingPanel'), meta: { main: true } }
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
