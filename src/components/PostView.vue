<template>
<v-container fill-height fluid grid-list-md>
  <v-layout v-if="loading" align-center justify-center>
    <v-progress-circular size="50" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <v-layout v-if="!loading">
    <v-flex xs12 md8 offset-md2>
      <v-layout justify-start column fill-height v-scroll="onScroll">
        <v-flex xs12>
          <v-card>
            <v-card-title class="headline pb-0">
              {{ title }}
            </v-card-title>
            <v-layout>
              <v-flex xs7 class='pr-0'>
                <v-list class='pt-0'>
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                    <img :src="'https://steemitimages.com/u/' + author + '/avatar/small'" alt="avatar" onerror="this.src='https://steemitimages.com/u/monawoo/avatar/small'">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ author }} <span class='reputation'>({{author_reputation | filterReputation}})</span></v-list-tile-title>
                      <v-list-tile-sub-title>{{created | filterCreated}} · {{category}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs5 text-xs-right class='pr-4 pt-3'>
                <div>
                  <router-link :to="'/@' + author + '/' + permlink + '/vote'" class='mr-1'>좋아요 {{ net_votes }}</router-link>
                  <!-- <a @click="voteDialog === true">좋아요 {{ net_votes }}</a> -->
                   · 댓글 {{ children }}
                </div>
                <!-- <strong>${{ payout_value }}</strong> -->
                <v-tooltip bottom>
                  <strong slot="activator">${{ payoutValue }}</strong>
                  <div v-if="pending_payout_value > 0"> 예상 보상금액: ${{ payoutValue }}<br>
                  <!-- (0.00 SBD, 0.25 STEEM, 0.25 SP)<br> -->
                  {{ payoutTime }} 후</div>
                  <div v-if="pending_payout_value === 0">
                     지급된 보상 ${{ payoutValue }}<br>
                    - 저자 ${{ total_payout_value }}<br>
                    - 큐레이터 ${{ curator_payout_value }}
                  </div>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-card-text>
              <article v-html="body"></article>
            </v-card-text>
            <v-card-text>
              <template v-for="tag in tags">
                <a href='javascript:false' class='tag' :key='tag'>#{{ tag }}</a>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-subheader class='pl-0'>댓글 ({{children}})</v-subheader>
          <v-card ref='comments'>
            <v-container grid-list-md v-if='!loadedComments'>
              <v-layout align-center justify-center>
                <v-progress-circular color="primary" indeterminate></v-progress-circular>
              </v-layout>
            </v-container>
            <template v-if='loadedComments'>
              <Comments :comments='comments'></Comments>
            <!-- <v-container grid-list-xs>
              <v-layout column> -->
                  <!-- <v-card flat style='padding:0' class='comments' v-for="c in comments" :key="c.id" >
                    <v-card-title class="grey--text pb-1">
                      {{ c.author }} 
                      <span class='reputation'>({{c.author_reputation | filterReputation}})</span>
                      · {{c.created | filterCreated}}
                    </v-card-title>
                    <v-card-text class='pt-0 pb-0' v-html='c.body'></v-card-text>
                    <v-card-actions class='pr-3'>
                      <v-btn small flat><v-icon left dark class='mr-2'>favorite_border</v-icon> 좋아요({{c.net_votes}})</v-btn>
                      <v-spacer></v-spacer>
                      <strong>${{ c.payout_value }}</strong>
                    </v-card-actions>
                    <v-divider></v-divider>
                  </v-card> -->
              <!-- </v-layout>
            </v-container> -->
            </template>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</v-container>
</template>
<script>
import steem from 'steem'
import Remarkable from 'remarkable'
import hljs from 'highlight.js'
import _ from 'lodash'
import Comments from '@/components/Comments'

const md = new Remarkable({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
  breaks: true
})

export default {
  components: { Comments },
  data () {
    return {
      loading: true,
      permlink: '',
      title: '',
      body: '',
      author: '',
      author_reputation: 0,
      category: '',
      children: 0,
      net_votes: 0,
      created: '',
      total_payout_value: 0,
      curator_payout_value: 0,
      pending_payout_value: 0,
      cashout_time: '',
      tags: [],
      comments: [],
      loadedComments: false
    }
  },
  computed: {
    // payout_value 금액 계산
    payoutValue () {
      return (this.total_payout_value + this.curator_payout_value + this.pending_payout_value).toFixed(3)
    },
    payoutTime () {
      const time = (new Date(this.cashout_time) - new Date()) / 1000
      if (time > 86400) {
        return Math.round(time / 86400) + '일'
      } else if (time > 3600) {
        return Math.round(time / 3600) + '시간'
      } else if (time > 60) {
        return Math.round(time / 60) + '분'
      } else {
        return Math.round(time) + '초'
      }
    },
    commentsOffsetTop () {
      // const { offsetTop, offsetHeight } = this.$refs.comments.$el
      // return offsetTop + offsetHeight + 60
      return this.loading ? 99999 : this.$refs.comments.$el.offsetTop
    }
  },
  deactivated () {
    // console.log(window.location.hash)
    // if (window.location.hash === '#/') {
    // 해당 컴포넌트가 비활성화 되었을때, 컴포넌트를 메모리에서 제거한다.
    // this.$destroy()
    // }
  },
  // beforeRouteEnter (to, from, next) {
  //   steem.api.getContentAsync(to.params.author, to.params.permlink)
  //     .then(r => {
  //       console.log('beforeRouteEnter', r)
  //       // next(vm => vm.setData(null, r))
  //     })
  // },
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출됩니다.
    '$route': 'fetchData'
  },
  // beforeCreate () {
  // const author = this.$route.params.author // path의 author 파람값
  // const permlink = this.$route.params.permlink // path의 permlink 파람값
  // // console.log(`@${author}/${permlink}`)
  created () {
    this.fetchData()
  },
  updated () {
    Array.prototype.forEach.call(document.querySelectorAll('article pre code'),
      function (block) {
        hljs.highlightBlock(block)
      })
    this.onScroll() // 스크롤이 없는 화면이 있는 경우
  },
  methods: {
    fetchData () {
      const author = this.$route.params.author // path의 author 파람값
      const permlink = this.$route.params.permlink // path의 permlink 파람값
      if (!author || !permlink) return
      // console.log(author, permlink)
      // console.log('$options', this.$options.data())
      Object.assign(this.$data, this.$options.data()) // 데이터 초기화
      steem.api.getContentAsync(author, permlink)
        .then(r => {
          // console.log(r)
          const metadata = JSON.parse(r.json_metadata)
          // console.log('metadata:', metadata)

          let body = r.body
          // # 1. 이미지 URL이 있는 경우 이미지 태그로 변환(정규식 테스트 필요!!!)
          // body = body.replace(/(https?:\/\/.*\.(?:jpe?g|gif|png)(\?.*)?(^[\n|\r\n])))/ig, '<img src="$1">')
          // body = body.replace(/(^http(s)?:\/\/steemit(dev|stage)?images.com\/.+)/g, '<img src="$1">')
          // body = body.replace(/(https?:\/\/steemit(dev|stage)?images.com(\/([0-9]+x[0-9]+))?\/.+)/g, '<img src="$1">')
          // body = body.replace(/([^\\(|>|'|"|\\/]https?:\/\/.*\.(?:jpe?g|gif|png)(\?.*)?)/ig, '<img src="$1">')
          body = body.replace(/(https?:\/\/steemit(dev|stage)?images.com(\/([0-9]+x[0-9]+))?\/.*\.(?:jpe?g|gif|png)(\?.*)?)/gi, '<img src="$1">')
          body = body.replace(/[^\\(|>|'|"|\\/](https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,}))))/gi, `<img src="$1"/>`)
          // console.log(body)

          // # 2. 유튜브 URL이 있는 경우 동영상 태그로 치환
          body = body.replace(/https:\/\/www.youtube.com\/watch\?[a-zA-Z]=([a-zA-Z0-9]*)/gi, '<div class="videoWrapper"><iframe src="https://www.youtube.com/embed/$1"></iframe></div></p>')
          body = body.replace(/https:\/\/youtu.be\/([\w]*)/gi, '<div class="videoWrapper"><iframe src="https://www.youtube.com/embed/$1"></iframe></div></p>')

          // # 3. @유저명 치환(?)

          // # 4. #태그 치환(?)

          // # 9. 마크다운인 경우 HTML 로 변환
          body = md.render(body)
          // console.log('md -> html:', body)

          this.permlink = r.permlink
          this.title = r.title
          this.body = body
          this.category = r.category
          this.children = r.children
          this.net_votes = r.net_votes
          this.author = r.author
          this.created = r.created
          this.author_reputation = r.author_reputation
          this.total_payout_value = parseFloat(r.total_payout_value.split(' ')[0])
          this.curator_payout_value = parseFloat(r.curator_payout_value.split(' ')[0])
          this.pending_payout_value = parseFloat(r.pending_payout_value.split(' ')[0])
          this.cashout_time = r.cashout_time
          this.tags = metadata.tags

          this.loadedComments = (r.children === 0)
        })
        .catch(e => console.log(e))
        .finally(() => (this.loading = false))
    },
    onScroll () {
      const windowOffsetTop = window.pageYOffset || document.documentElement.scrollTop
      const windowOffsetBottom = windowOffsetTop + window.innerHeight
      // if (!this.loadedComments && (this.commentsOffsetTop > windowOffsetBottom - 10 || this.commentsOffsetTop < windowOffsetBottom + 10)) {
      // console.log(this.commentsOffsetTop, windowOffsetBottom)
      if (!this.loadedComments && windowOffsetBottom > this.commentsOffsetTop) {
        console.log('댓글 영역 도달!!!')
        this.getComments()
      }
    },
    getComments: _.debounce(function () {
      console.log('댓글 로드!!!')
      const path = `/${this.category}/@${this.author}/${this.permlink}` // 댓글을 가져올 글의 path
      console.log('path:', path)
      steem.api.getStateAsync(path)
        .then(({ content }) => {
          console.log(content)
          this.loadedComments = true

          // 댓글 목록 조회
          const root = _.find(content, { depth: 0 }) // content에서 본문만 가져오기
          addComments(content, root) // 재귀함수 호출
          this.comments = root.comments
        })
    }, 500)
  }
}

function addComments (contents, root) {
  if (root.children > 0) { // root가 children를 가지고 있으면 실행
    if (!root.comments) root.comments = [] // root의 댓글을 담을 comments 변수 초기화
    root.replies.forEach(key => { // 댓글key를 가지고 있는 root.replies 배열을 반복하여 contents에서 key와 매칭되는 댓글 데이터 가져옴
      const comment = _.pick(contents[key], ['id', 'author', 'author_reputation', 'body', 'created', 'net_votes', 'permlink', 'parent_author', 'parent_permlink', 'url', 'children', 'depth', 'replies', 'total_payout_value', 'curator_payout_value', 'pending_payout_value'])
      comment.payout_value = (parseFloat(comment.total_payout_value.split(' ')[0]) + parseFloat(comment.curator_payout_value.split(' ')[0]) + parseFloat(comment.pending_payout_value.split(' ')[0])).toFixed(2)
      root.comments.push(comment) // root의 댓글목록에 추가
      addComments(contents, comment) // 현재 댓글에 자식 댓글이 있는지 찾기 위해 재귀함수 호출
    })
  }
}
</script>
<style>
article img {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: none;
    display: inline-block;
    vertical-align: middle;
    border-style: none;
}
article hr {
    clear: both;
    max-width: 75rem;
    height: 0;
    margin: 1.25rem auto;
    border-top: 0;
    border-right: 0;
    border-bottom: 1px solid #eee;
    border-left: 0;
    box-sizing: content-box;
    overflow: visible;
}
article h1, article h2, article h3, article h4, article h5, article h6 {
    font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600; 
}
article h1 {
  margin: 2.5rem 0 .3rem;
  font-size: 160%; 
}
article h2 {
  margin: 2.5rem 0 .3rem;
  font-size: 140%; 
}
article h3 {
  margin: 2rem 0 0.3rem;
  font-size: 120%; 
}
article h4 {
  margin: 1.5rem 0 0.2rem;
  font-size: 110%; 
}
articleh5 {
  margin: 1rem 0 0.2rem;
  font-size: 100%; 
}
article h6 {
  margin: 1rem 0 0.2rem;
  font-size: 90%; 
}
article code {
  padding: 0.2rem;
  font-size: 85%;
  border-radius: 3px;
  border: none;
  background-color: #F4F4F4;
  font-weight: inherit;
  overflow: scroll; 
  display: inline;
}
article pre > code {
  display: block; 
}
article strong {
  font-weight: 600; 
}
article ol, article ul {
  margin: 0;
  padding: 0;
  margin-left: 2rem; 
}
article table td {
  word-break: normal; 
}
article p {
  font-size: 100%;
  line-height: 150%;
  margin: 0 0 1.5rem 0; 
}
article iframe {
  max-width: 100%;
  max-height: 75vw; 
}
article div.pull-right {
  float: right;
  padding-left: 1rem;
  max-width: 50%; 
}
article div.pull-left {
  float: left;
  padding-right: 1rem;
  max-width: 50%; 
}
article div.text-justify {
  text-align: justify; 
}
article div.text-right {
  text-align: right; 
}
article div.text-center {
  text-align: center; 
}
article div.text-rtl {
  direction: rtl; 
}
article div.videoWrapper {
  width: 100%;
  height: 0;
  padding-bottom: 56.2%;
  position: relative; 
}
article div.videoWrapper iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0; 
  border: 0;
}
article blockquote {
  border-left: 5px solid #eee;
  margin: 0 0 1rem;
  padding: 0.5625rem 1.25rem 0 1.1875rem;
}
article blockquote p {
  font-size: 100%;
  line-height: 150%;
  margin: 0 0 1.5rem 0;
  color: #788187; 
}
article table {
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 3px; 
}
article thead,
article tbody,
article tfoot {
  border: 1px solid #f1f1f1;
  background-color: #fefefe; 
}
article caption {
  padding: 0.5rem 0.625rem 0.625rem;
  font-weight: bold; 
}
article thead {
  background: #f8f8f8;
  color: #333333; 
}
article tfoot {
  background: #f1f1f1;
  color: #333333; 
}
article thead tr,
article tfoot tr {
  background: transparent; 
}
article thead th,
article thead td,
article tfoot th,
article tfoot td {
  padding: 0.5rem 0.625rem 0.625rem;
  font-weight: bold;
  text-align: left; 
}
article tbody th,
article tbody td {
  padding: 0.5rem 0.625rem 0.625rem; 
}
article  tbody tr:nth-child(even) {
  border-bottom: 0;
  background-color: #f1f1f1; 
}
article table.unstriped tbody {
  background-color: #fefefe; 
}
article table.unstriped tbody tr {
  border-bottom: 0;
  border-bottom: 1px solid #f1f1f1;
  background-color: #fefefe; 
}
article a {
  text-decoration: none;
  transition: 0.2s all ease-in-out;
  cursor: pointer;
}
article a, article a:visited {
  color: #1FBF8F;
}
article a:hover  {
  color: #06D6A9; 
}
article a:after {
  content: 'launch';
  font-family: 'Material Icons' !important;
  font-weight: normal;
  font-style: normal;
  vertical-align: bottom;
  display: inline-block;
  margin-left: 0.2em;
  opacity: .5;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;  
}
article sub, article sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
article sub {
  bottom: -0.25em;
}
article sup {
  top: -0.5em;
}
a.tag {
  color: #333;
  text-decoration: none;
  border: 1px solid #eee;
  display: inline-block;
  margin: 0.1rem 0.4rem 0.1rem 0;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  transition: 0.2s all ease-in-out;
}
a.tag:hover {
  background: #fcfcfc;
  border: 1px solid #788187;
}
.comments {
  font-size: 92%;
}
</style>