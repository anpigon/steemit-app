<template>
<v-container fluid grid-list-md>
  <v-layout v-if="!loading">
    <v-flex xs12 md8 offset-md2>
      <v-layout justify-start column>
        <v-flex>
          <v-card>
            <v-card-title class="title pb-0">
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
                <div>좋아요 {{ net_votes }} · 댓글 {{ children }}</div>
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
                <!--
                   예상 보상금액: $0.45
                  (0.00 SBD, 0.25 STEEM, 0.25 SP)
                  7일 후
                  -->
                <!--
                  지급된 보상 $2.16
                  - 저자 $1.64
                  - 큐레이터 $0.52
                  -->
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex>
          <v-subheader class='pl-0 subheading'>보팅<small>({{ net_votes }})</small></v-subheader>
          <v-data-table
            :headers="headers"
            :items="votes"
            hide-actions
            disable-initial-sort
            :loading="loading"
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.voter }} <span class='reputation'>({{ props.item.reputation }})</span></td>
              <!-- <td>{{ props.item.reputation }}</td> -->
              <td class="text-xs-right">${{ props.item.value }}</td>
              <td class="text-xs-right">{{ props.item.weight }}%</td>
              <td class="text-xs-right">{{ props.item.curation }}</td>
              <td class="text-xs-right">{{ props.item.time | formatTime }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</v-container>
</template>
<script>
import steem from 'steem'
import { mapState } from 'vuex'

export default {
  name: 'VoteHistory',
  data () {
    return {
      pagination: {
        index: 5
      },
      loading: true,
      headers: [
        {
          text: '사용자',
          align: 'left',
          sortable: true,
          value: 'reputation'
        },
        // {
        //   text: '명성',
        //   align: 'left',
        //   sortable: true,
        //   value: 'reputation'
        // },
        {
          text: '보팅금액',
          align: 'right',
          sortable: true,
          value: 'value'
        },
        {
          text: '가중치',
          align: 'right',
          sortable: true,
          value: 'weight'
        },
        {
          text: '큐레이션',
          align: 'right',
          sortable: true,
          value: 'curation'
        },
        {
          text: '시간',
          align: 'center',
          sortable: true,
          value: 'time'
        }
      ],
      active_votes: [],
      total_vote_weight: 0,
      pending_payout_value: 0,
      total_payout_value: 0,
      curator_payout_value: 0,
      title: '',
      author: '',
      author_reputation: 0,
      created: '',
      category: '',
      net_votes: 0,
      children: 0,
      cashout_time: ''
    }
  },
  filters: {
    formatTime: (v) => {
      const d = new Date(v)
      return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
    }
  },
  computed: {
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
    payoutValue () {
      return this.pending_payout_value + this.total_payout_value + this.curator_payout_value
    },
    votes () {
      let totalRshares = 0
      let totalWeight = 0
      this.active_votes.forEach(e => {
        totalRshares += parseFloat(e.rshares) // 해당 포스트에 보팅된 총 리워드 계산
        totalWeight += parseFloat(e.weight) // 해당 포스트에 보팅된 총 가중치 계산
      })
      // console.log('total_vote_weight: ' + this.total_vote_weight, 'totalWeight: ' + totalWeight)
      return this.active_votes.map(e => {
        let value, curation
        if (this.pending_payout_value > 0) { // 페이아웃 이전
          value = (e.rshares * (this.global.rewardBalance / this.global.recentClaims) * this.global.price) // 업보팅한 금액
          curation = (e.weight / this.total_vote_weight * this.pending_payout_value * 0.25 / this.global.price).toFixed(3) + ' SP' // 받을 큐레이션 보상
        } else { // 페이아웃 이후
          const o = this.total_payout_value / (this.total_payout_value + this.curator_payout_value)
          value = e.rshares / totalRshares * parseFloat(this.total_payout_value / o) // 업보팅한 금액
          curation = '$' + (e.weight / totalWeight * this.curator_payout_value).toFixed(3) // 받은 큐레이션 보상
        }
        return {
          voter: e.voter,
          reputation: steem.formatter.reputation(e.reputation),
          weight: e.percent / 100,
          value: value.toFixed(3),
          curation: curation,
          time: new Date(e.time + 'Z')
        }
      })
    },
    ...mapState({
      global: state => state.global
    })
  },
  beforeCreate () {
    const author = this.$route.params.author // path의 author 파람값
    const permlink = this.$route.params.permlink // path의 permlink 파람값

    steem.api.getContentAsync(author, permlink)
      .then(n => {
        console.log(n)
        this.title = n.title
        this.total_vote_weight = n.total_vote_weight
        this.pending_payout_value = parseFloat(n.pending_payout_value.split(' ')[0]) // 지급예정 보장(저자+큐레이션)
        this.total_payout_value = parseFloat(n.total_payout_value.split(' ')[0]) // 지급된 보상
        this.curator_payout_value = parseFloat(n.curator_payout_value.split(' ')[0]) // 지급된 큐레이션 보상
        this.active_votes = n.active_votes
        this.author = n.author
        this.author_reputation = n.author_reputation
        this.created = n.created
        this.category = n.category
        this.net_votes = n.net_votes
        this.children = n.children
        this.cashout_time = n.cashout_time
      })
      .catch(e => console.log(e))
      .finally(() => (this.loading = false))
  },
  created () {
    this.$store.dispatch('global/loadGlobalProperties')
  }
}
</script>