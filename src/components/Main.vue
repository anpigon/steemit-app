<template>
  <v-container fill-height fluid grid-list-md>
    <v-layout>
      <!-- <v-flex xs12 md3>
          <v-card><v-card-title>TEST</v-card-title>
          </v-card>
      </v-flex>  -->
      <v-flex xs12 md9 offset-md3> 
        <v-layout row wrap>
          <v-flex xs12 md6 xl4 v-for="d in discussions" :key="d.id">
            <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                  <img :src="'https://steemitimages.com/u/' + d.author + '/avatar'" alt="avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ d.author }} ({{ d.author_reputation }})</v-list-tile-title>
                    <v-list-tile-sub-title>{{ d.created }} · {{ d.category }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-card-media
                v-if="d.image"
                :src="d.image"
                height="200px">
              </v-card-media>
              <v-list three-line>
                <v-list-tile :to="['detail', d.author, d.permlink].join('/')">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ d.title }}</v-list-tile-title>
                    <v-list-tile-sub-title class='ellipsis'>{{ d.body }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-card-title class='pt-0'>
                좋아요 {{ d.net_votes }}명 · 댓글 {{ d.children }}명
                <v-spacer></v-spacer>
                <strong>${{ d.payout_value }}</strong>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn flat><v-icon left dark>favorite_border</v-icon> 좋아요</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat><v-icon left dark>comment</v-icon> 댓글달기</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat><v-icon left dark>reply</v-icon> 공유하기</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import steem from 'steem' // 스팀잇 라이브러리 임포트
import Remarkable from 'remarkable'

const md = new Remarkable({ html: true, linkify: true })

export default {
  data () {
    return {
      discussions: []
    }
  },
  methods: {
    getDiscussions () {
      let query = {
        tag: 'kr',
        limit: 10
      }
      // 스팀잇 최근글 가져오기
      steem.api.getDiscussionsByCreated(query, (err, result) => {
        if (!err) {
          this.discussions = result.map((item) => {
            const metadata = JSON.parse(item.json_metadata) // 메타데이터 JSON 파싱
            const image = metadata.image ? metadata.image[0] : '' // 이미지 URL

            const totalPayoutValue = parseFloat(item.total_payout_value.split(' ')[0])
            const curatorPayoutValue = parseFloat(item.curator_payout_value.split(' ')[0])
            const pendingPayoutCalue = parseFloat(item.pending_payout_value.split(' ')[0])
            item.payout_value = (totalPayoutValue + curatorPayoutValue + pendingPayoutCalue).toFixed(2)

            item.author_reputation = steem.formatter.reputation(item.author_reputation) // 저자 명성

            const now = new Date()
            const created = new Date(item.created + 'Z')
            const elapsedSeconds = (now - created) / 1000 // 경과 시간(초)
            if (elapsedSeconds < 60) {
              item.created = Math.round(elapsedSeconds) + '초 전'
            } else if (elapsedSeconds < 360) {
              item.created = Math.round(elapsedSeconds / 60) + '분 전'
            } else if (elapsedSeconds < 8640) {
              item.created = Math.round(elapsedSeconds / 60) + '시간 전'
            } else if (elapsedSeconds < 207360) {
              item.created = '어제'
            } else {
              item.created = (now.getFullYear() !== created.getFullYear() ? created.getFullYear() + '년 ' : '') +
                                      (created.getMonth() + 1) + '월 ' +
                                      created.getDate() + '일'
            }

            item.body = md.render(item.body).replace(/<\/?[^>]+(>|$)/g, '')

            return {
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
        }
      })
    }
  },
  created () {
    this.getDiscussions()
  }
}
</script>
<style>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
}
</style>