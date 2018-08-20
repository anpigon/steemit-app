<template>
  <v-card v-if='account.name'>
    <v-card-media>
      <img :src="'https://steemitimages.com/0x100/' + account.coverImage">
    </v-card-media>
    <v-avatar size="64">
      <img :src="'https://steemitimages.com/128x128/' + account.profileImage">
      </v-avatar>
    <v-card-title class='pt-0'>
      <div class='username'>
        <span>{{ account.name }}</span>
        <span>({{ account.reputation }})</span>
        <div>@{{ username }}</div>
      </div>
      <div class='hidden-sm-and-down'>수면의 과학</div>
    </v-card-title>
    <v-card-text class='pt-0'>
      <div><v-icon small>power</v-icon> 보팅 파워: {{ this.votePower.toFixed(2) }}%</div>
      <div><v-icon label small>attach_money</v-icon> 보팅 금액: ${{ upvoteValue.toFixed(3) }}</div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'UserProfilePanel',
  computed: {
    ...mapState('auth', ['username']),
    ...mapState({
      global: state => state.global
    }),
    ...mapState({
      account: state => state.account
    }),
    vestingSteem () {
      return this.formatterVestingSteem(this.account.vestingShares)
    },
    delegatedVestingSteem () {
      return this.formatterVestingSteem(this.account.delegatedVestingShares)
    },
    receivedVestingSteem () {
      return this.formatterVestingSteem(this.account.receivedVestingShares)
    },
    totalSteemPower () {
      return this.vestingSteem + this.delegatedVestingSteem + this.receivedVestingSteem
    },
    votePower () {
      const elapsedSeconds = (new Date() - new Date(this.account.lastVoteTime + 'Z')) / 1000 // 마지막 보팅 후 경과 시간
      const regeneratedPower = (10000 * elapsedSeconds) / (60 * 60 * 24 * 5) // 재생된 보팅파워
      const currentPower = Math.round(Math.min(this.account.votingPower + regeneratedPower, 10000)) // 현재 보팅파워
      return (currentPower / 100) || 0
    },
    remainHours () {
      return (10000 - this.votePower) * (5 * 60 * 60 * 24) / (60 * 60 * 10000)
    },
    upvoteValue () {
      const rate = parseInt((this.votePower * 100 + 49) / 50) * 100
      console.log('rate:', rate)
      let upvoteValue = this.totalSteemPower / (this.global.totalVestingFundSteem / this.global.totalVestingShares) * rate * (this.global.rewardBalance / this.global.recentClaims)
      console.log('upvoteValue1:', upvoteValue)
      upvoteValue = upvoteValue * this.global.price
      console.log('upvoteValue2:', upvoteValue)
      return upvoteValue || 0
    }
  },
  // beforeMount () {
  created () {
    console.log('getAccounts')
    this.$store.dispatch('global/loadGlobalProperties')
    this.$store.dispatch('account/loadAccount', this.username)
  },
  mounted () {
    console.log('account', this.account)
  },
  methods: {
    formatterVestingSteem (vestingShares) {
      return this.global.totalVestingFundSteem * (vestingShares / this.global.totalVestingShares)
    }
  }
}
</script>
<style scoped>
.v-avatar {
  margin: -120px 0px 0px 15px;
}
.v-avatar img {
  border: 2px solid #fff
}
.username {
  position: absolute;
  top: 26px;
  left: 95px;
  color: white;
  line-height: 160%;
  font-weight:bold;
  text-shadow: 0 0 4px rgba(0,0,0,.8);
}
.username > span:first-child {
  font-size: 32px;
}
@media only screen and (max-width: 959px) {
  .v-card__title {
    padding: 0;
  }
}
</style>
