<template>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
      <v-layout row wrap>
        <v-flex xs12 md6 xl4 v-for="d in discussions" :key="d.id">
          <v-card>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                <img :src="'https://steemitimages.com/u/' + d.author + '/avatar/small'" alt="avatar" onerror="this.src='https://steemitimages.com/u/monawoo/avatar/small'">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ d.author }} <span class='reputation'>({{ d.author_reputation }})</span></v-list-tile-title>
                  <v-list-tile-sub-title>{{ d.created | filterCreated }} · {{ d.category }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-card-media
              v-if="d.image"
              :src="'https://steemitimages.com/640x480/' + d.image"
              height="200px">
            </v-card-media>
            <v-card-media v-if="!d.image" src="https://steemit.com/images/steemit.png" height="200px"></v-card-media>
            <v-list three-line>
              <v-list-tile :to="'/@' + d.author + '/' + d.permlink">
                <v-list-tile-content>
                  <v-list-tile-title>{{ d.title }}</v-list-tile-title>
                  <v-list-tile-sub-title class='text-ellipsis'>{{ d.body }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-card-title class='pt-0'>
              <router-link :to="'/@' + d.author + '/' + d.permlink + '/vote'" class='mr-1'>좋아요 {{ d.net_votes }}명</router-link> · 댓글 {{ d.children }}명
              <v-spacer></v-spacer>
              <strong>${{ d.payout_value }}</strong>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn flat><v-icon left dark class='mr-2'>favorite_border</v-icon> 좋아요</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat><v-icon left dark class='mr-2'>comment</v-icon> 댓글달기</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat><v-icon left dark class='mr-2'>reply</v-icon> 공유하기</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex><!-- // v-for END -->
      </v-layout>
      <div class="text-xs-center mt-3 mb-1" v-show="next.exist">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </div>
</template>
<script>
import steem from 'steem' // 스팀잇 라이브러리 임포트
import Remarkable from 'remarkable'
import infiniteScroll from 'vue-infinite-scroll'
// import { mapState, mapGetters } from 'vuex'

const md = new Remarkable({ html: true, linkify: true })

export default {
  name: 'Discussions',
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
  // watch: {
  //   '$route' (to, from) {
  //     console.log('to:', to, '\nfrom:', from)
  //     getDiscussions()
  //   }
  // },
  methods: {
    loadMore: function () {
      this.busy = true
      // this.$refs.infiniteScroll.$el.scrollTop = this.$refs.infiniteScroll.$el.scrollHeight
      this.getDiscussions().then(result => {
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
      }).catch(err => console.log(err))
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
      return steem.api.getDiscussionsByCreatedAsync(query)
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