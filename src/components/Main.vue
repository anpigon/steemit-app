<template>
  <v-container fill-height grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 md3>
        
        <component :is='UserProfilePanel'></component>

        <v-card class='mt-1' v-if="false">
          <v-card-title primary-title>
            <h3 class="mb-0" style='font-size: 18px;font-weight: bold;'>인기있는 태그</h3>
          </v-card-title>
          <v-card-text class='pt-0'>
            <ul class='trends' style='list-style: none;margin:0;padding:0;font-weight: bold;font-size: 1.1em'>
              <li style='line-height: 17px;margin-bottom: 10px;'><a href="#" class='trend-name'>life</a></li>
              <li><a href="#" class='trend-name'>photography</a></li>
              <li><a href="#" class='trend-name'>kr</a></li>
              <li><a href="#" class='trend-name'>steemit</a></li>
              <li><a href="#" class='trend-name'>art</a></li>
              <li><a href="#" class='trend-name'>bitcoin</a></li>
              <li><a href="#" class='trend-name'>introduceyourself</a></li>
              <li><a href="#" class='trend-name'>spanish</a></li>
              <li><a href="#" class='trend-name'>travel</a></li>
              <li><a href="#" class='trend-name'>cryptocurrency</a></li>
              <li><a href="#" class='trend-name'>food</a></li>
              <li><a href="#" class='trend-name'>steem</a></li>
              <li><a href="#" class='trend-name'>busy</a></li>
              <li><a href="#" class='trend-name'>blog</a></li>
              <li><a href="#" class='trend-name'>funny</a></li>
            </ul>
            <a href='#' style='font-weight: bold;color: #99aab5;display: inline-block;margin: 12px 0;font-size: 1.2em;font-weight: 500;'>더 보기</a>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md9>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import steem from 'steem' // 스팀잇 라이브러리 임포트
import Remarkable from 'remarkable'
import infiniteScroll from 'vue-infinite-scroll'
// import { mapState, mapGetters } from 'vuex'

const md = new Remarkable({ html: true, linkify: true })

export default {
  data: () => ({
    discussions: [],
    busy: false,
    next: {
      exist: true,
      permlink: null,
      author: null
    }
  }),
  computed: {
    // isLogin () {
    //   return this.$store.getters['auth/isLogin']
    // },
    // ...mapGetters('auth', [ 'isLogin' ]),
    // ...mapState('auth', [ 'username' ]),
    UserProfilePanel () {
      // console.log('isLogin:', this.$store.getters['auth/isLogin'])
      // if (this.isLogin) {
      if (this.$store.getters['auth/isLogin']) {
        return () => import('@/components/panels/UserProfilePanel')
      } else {
        return () => ''
      }
    },
    type () {
      return this.$route
    }
  },
  // components: {
  //   UserProfilePanel: () => {
  //     console.log('this.isLogin:', this.isLogin)
  //     if (this.isLogin) {
  //       return import('@/components/panels/UserProfilePanel')
  //     } else {
  //       return ''
  //     }
  //   }
  // },
  directives: {
    infiniteScroll
  },
  methods: {
    loadMore: function () {
      this.busy = true
      // this.$refs.infiniteScroll.$el.scrollTop = this.$refs.infiniteScroll.$el.scrollHeight
      this.getDiscussions()
      // window.scrollTo(0, document.body.scrollHeight)
      // var scrollingElement = (document.scrollingElement || document.body)
      // scrollingElement.scrollTop = scrollingElement.scrollHeight
      // scrollingElement.scrollIntoView(false)
      // scrollingElement.scrollIntoView({ behavior: 'smooth' })
      // scrollingElement.animate({ scrollTop: scrollingElement.scrollHeight }, 'slow')
    },
    getDiscussions () {
      // steem.api.getDiscussionsByBlog(
      // await steem.api.getDiscussionsByFeedAsync({tag:'anpigon', limit: 11})
      // steem.api.getDiscussionsByHot(
      // steem.api.getDiscussionsByPayout(
      // steem.api.getDiscussionsByCashout(
      // steem.api.getDiscussionsByTrending(
      let query = {
        tag: 'kr',
        limit: 11,
        start_permlink: this.next.permlink,
        start_author: this.next.author
      }
      // 스팀잇 최근글 가져오기
      steem.api.getDiscussionsByCreated(query, (err, result) => {
        // this.$refs.infiniteScroll.$el.scrollTop = this.$refs.infiniteScroll.$el.scrollHeight
        if (err) {
          console.log(err)
          return
        }

        // 가져온 데이터를 items 에 담는다.
        const items = result.slice(0, 10).map(item => {
          const metadata = JSON.parse(item.json_metadata) // 메타데이터 JSON 파싱
          const image = metadata.image ? metadata.image[0] : '' // 이미지 URL

          const totalPayoutValue = parseFloat(item.total_payout_value.split(' ')[0])
          const curatorPayoutValue = parseFloat(item.curator_payout_value.split(' ')[0])
          const pendingPayoutCalue = parseFloat(item.pending_payout_value.split(' ')[0])
          item.payout_value = (totalPayoutValue + curatorPayoutValue + pendingPayoutCalue).toFixed(2)

          item.author_reputation = steem.formatter.reputation(item.author_reputation) // 저자 명성

          item.created = item.created

          item.body = md.render(item.body).replace(/<\/?[^>]+(>|$)/g, '')

          return {
            id: item.id,
            image: image,
            author: item.author,
            author_reputation: item.author_reputation,
            title: item.title,
            created: item.created,
            body: item.body.substr(0, 200),
            category: item.category,
            permlink: item.permlink,
            url: item.url,
            payout_value: item.payout_value,
            net_votes: item.net_votes,
            children: item.children
          }
        })

        // items배열을 기존 discussions 배열과 합친다.
        this.discussions = this.discussions.concat(items)

        this.next.exist = (result.length > 10)
        // 스크롤 활성화
        if (this.next.exist) {
          this.next.permlink = result[10].permlink
          this.next.author = result[10].author
          this.busy = false
        }
      })
    }
  },
  created () {
    // this.getDiscussions()
    // console.log('isLogin', this.isLogin)
    // this.$store.dispatch('global/loadGlobalProperties')
    console.log('Main.vue created => type:', this.type)
  },
  deactivated () {
    this.busy = true
  },
  activated () {
    this.busy = false
    // console.log('username', this.$store.state.auth.username)
  }
}
</script>
<style scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -moz-box;                /* Mozilla */
  display: -webkit-box;             /* WebKit */
  display: box;                     /* As specified */
  /*! autoprefixer: off */
  -moz-box-orient: vertical;      /* Mozilla */
  -webkit-box-orient: vertical;   /* WebKit */
  box-orient: vertical;           /* As specified */ 
  /*! autoprefixer: on */
}
.bottom {
  min-height: 10px;
  display: block;
}
@media only screen and (max-width: 1263px) {
  .v-content__wrap >  .container.fill-height {
    max-width: 100%;
  }
}
</style>