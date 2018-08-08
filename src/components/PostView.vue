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
                    <img :src="'https://steemitimages.com/u/' + author + '/avatar'" alt="avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ author }} <span class='reputation'>({{author_reputation | filterReputation}})</span></v-list-tile-title>
                      <v-list-tile-sub-title>{{created | filterCreated}} · {{category}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <v-flex xs5 text-xs-right class='pr-4 pt-3'>
                <div>좋아요 {{ net_votes }} · 댓글 {{ children }}</div>
                <strong>${{ payout_value }}</strong>
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
          <v-card ref='comments'>
            <v-container grid-list-md v-if='!loadedComments'>
              <v-layout align-center justify-center>
                <v-progress-circular color="primary" indeterminate></v-progress-circular>
              </v-layout>
            </v-container>
            <template v-if='loadedComments'>
            <!-- <v-container grid-list-xs>
              <v-layout column> -->
                  <v-card flat style='padding:0' class='comments' v-for="c in comments" :key="c.id" >
                    <v-card-title class="grey--text pb-1">
                      {{ c.author }} 
                      <span class='reputation'>({{c.author_reputation | filterReputation}})</span>
                      · {{c.created | filterCreated}}
                    </v-card-title>
                    <v-card-text class='pt-0 pb-0' v-html='c.body'></v-card-text>
                    <v-card-actions class='pr-3'>
                      <v-btn small flat><v-icon left dark class='mr-2'>favorite_border</v-icon> 좋아요({{c.net_votes}})</v-btn>
                      <v-spacer></v-spacer>
                      <!-- <v-btn small flat><v-icon left dark>comment</v-icon> 댓글달기</v-btn> -->
                      <strong>${{ c.payout_value }}</strong>
                    </v-card-actions>
                    <v-divider></v-divider>
                  </v-card>
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
// import infiniteScroll from 'vue-infinite-scroll'

// hljs.configure({
//   tabReplace: '  ' // 2 spaces
// })

const md = new Remarkable({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
  breaks: true
})

export default {
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
      tags: [],
      comments: [],
      loadedComments: false
    }
  },
  // directives: {
  //   infiniteScroll
  // },
  // computed 기능 구현
  computed: {
    // payout_value 금액 계산
    payout_value () {
      return (this.total_payout_value + this.curator_payout_value + this.pending_payout_value).toFixed(2)
    },
    commentsOffsetTop () {
      const { offsetTop, offsetHeight } = this.$refs.comments.$el
      return offsetTop + offsetHeight + 60
    }
  },
  deactivated () {
    // 해당 컴포넌트가 비활성화 되었을때, 컴포넌트를 메모리에서 제거한다.
    this.$destroy()
  },
  beforeCreate () {
    const author = this.$route.params.author // path의 author 파람값
    const permlink = this.$route.params.permlink // path의 permlink 파람값
    // console.log(`@${author}/${permlink}`)

    steem.api.getContentAsync(author, permlink)
      .then(r => {
        console.log(r)
        const metadata = JSON.parse(r.json_metadata)
        console.log('metadata:', metadata)

        let body = r.body

        // # 1. 이미지 URL이 있는 경우 이미지 태그로 변환(정규식 테스트 필요!!!)
        // body = body.replace(/(https?:\/\/.*\.(?:jpe?g|gif|png)(\?.*)?(^[\n|\r\n])))/ig, '<img src="$1">')
        body = body.replace(/([^\\(|>]https?:\/\/.*\.(?:jpe?g|gif|png)(\?.*)?)/ig, '<img src="$1">')
        // console.log('image replace:', body)

        // # 2. 유튜브 URL이 있는 경우 동영상 태그로 치환
        body = body.replace(/https:\/\/www.youtube.com\/watch\?[a-zA-Z]=([a-zA-Z0-9]*)/gi, '<div class="videoWrapper"><iframe src="https://www.youtube.com/embed/$1"></iframe></div></p>')
        body = body.replace(/https:\/\/youtu.be\/([\w]*)/gi, '<div class="videoWrapper"><iframe src="https://www.youtube.com/embed/$1"></iframe></div></p>')

        // # 3. @유저명 치환

        // # 4. #태그 치환

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
        this.tags = metadata.tags
      })
      .catch(e => console.log(e))
      .finally(() => (this.loading = false))
  },
  updated () {
    Array.prototype.forEach.call(document.querySelectorAll('article pre code'),
      function (block) {
        hljs.highlightBlock(block)
      })
  },
  methods: {
    onScroll () {
      const windowOffsetTop = window.pageYOffset || document.documentElement.scrollTop
      const windowOffsetBottom = windowOffsetTop + window.innerHeight
      if (!this.loadedComments && (this.commentsOffsetTop > windowOffsetBottom - 10 || this.commentsOffsetTop < windowOffsetBottom + 10)) {
        console.log('댓글 영역 도달!!!')
        this.getComments()
      }
    },
    getComments: _.debounce(function () {
      console.log('댓글 로드!!!')
      const path = `/${this.category}/@${this.author}/${this.permlink}` // 댓글을 가져올 글의 path
      console.log('path:', path)
      steem.api.getStateAsync(path)
        .then(r => {
          console.log(r)
          this.loadedComments = true
          this.comments = []
          // const contentPath = `${this.author}/${this.permlink}`
          for (let key in r.content) {
            const comment = r.content[key]
            // console.log(key, comment)
            // if (comment.author === this.author && comment.permlink === this.permlink) return true
            if (comment.url === path) continue
            // console.log('this.comments.push(comment)')
            // comment.parent_permlink 값으로 부모, 자식 판단
            // TODO: 재귀함수 호출 필요!!!
            const item = _.pick(comment, ['id', 'author', 'author_reputation', 'body', 'created', 'net_votes', 'parent_author', 'parent_permlink', 'url', 'children', 'depth'])
            item.payout_value = (parseFloat(comment.total_payout_value.split(' ')[0]) + parseFloat(comment.curator_payout_value.split(' ')[0]) + parseFloat(comment.pending_payout_value.split(' ')[0])).toFixed(2)
            // console.log('item', item)
            this.comments.push(item)
          }
        })
    }, 500)
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