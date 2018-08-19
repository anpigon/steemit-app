<template>
<v-container fluid grid-list-md>
  <v-layout v-if="!loading">
    <v-flex xs12 md8 offset-md2>
      <v-layout justify-start column>
        <v-flex>
          <v-card>
            <v-card-title>
              {{ title }}
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex>
          <v-data-table
            :headers="headers"
            :items="votes"
            hide-actions
            disable-initial-sort
            :loading="loading"
            class="elevation-1">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.voter }}</td>
              <td>{{ props.item.reputation }}</td>
              <td class="text-xs-right">${{ props.item.value }}</td>
              <td class="text-xs-right">{{ props.item.weight }}%</td>
              <td class="text-xs-right">{{ props.item.curation }}</td>
              <td class="text-xs-right">{{ props.item.time }}</td>
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
          value: 'voter'
        },
        {
          text: '명성',
          align: 'left',
          sortable: true,
          value: 'reputation'
        },
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
      activeVotes: [],
      totalVoteWeight: 0,
      pendingPayoutValue: 0,
      totalPayoutValue: 0,
      curatorPayoutValue: 0,
      title: ''
    }
  },
  // filters: {
  //   formatDate (v) {
  //     return v
  //   }
  // },
  computed: {
    totalPayout () {
      return this.pendingPayoutValue + this.totalPayoutValue + this.curatorPayoutValue
    },
    votes () {
      let totalRshares = 0
      let totalWeight = 0
      this.activeVotes.forEach(e => {
        totalRshares += parseFloat(e.rshares) // 해당 포스트에 보팅된 총 리워드 계산
        totalWeight += parseFloat(e.weight) // 해당 포스트에 보팅된 총 가중치 계산
      })
      // console.log('totalVoteWeight: ' + this.totalVoteWeight, 'totalWeight: ' + totalWeight)
      return this.activeVotes.map(e => {
        let value, curation
        if (this.pendingPayoutValue > 0) { // 페이아웃 이전
          value = (e.rshares * (this.global.rewardBalance / this.global.recentClaims) * this.global.price) // 업보팅한 금액
          curation = (e.weight / this.totalVoteWeight * this.pendingPayoutValue * 0.25 / this.global.price).toFixed(3) + ' SP' // 받을 큐레이션 보상
        } else { // 페이아웃 이후
          const o = this.totalPayoutValue / (this.totalPayoutValue + this.curatorPayoutValue)
          value = e.rshares / totalRshares * parseFloat(this.totalPayoutValue / o) // 업보팅한 금액
          curation = '$' + (e.weight / totalWeight * this.curatorPayoutValue).toFixed(3) // 받은 큐레이션 보상
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
        this.totalVoteWeight = n.total_vote_weight
        this.pendingPayoutValue = parseFloat(n.pending_payout_value.split(' ')[0]) // 지급예정 보장(저자+큐레이션)
        this.totalPayoutValue = parseFloat(n.total_payout_value.split(' ')[0]) // 지급된 보상
        this.curatorPayoutValue = parseFloat(n.curator_payout_value.split(' ')[0]) // 지급된 큐레이션 보상
        this.activeVotes = n.active_votes
      })
      .catch(e => console.log(e))
      .finally(() => (this.loading = false))
  },
  created () {
    this.$store.dispatch('global/loadGlobalProperties')
  }
}
</script>