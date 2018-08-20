import steem from 'steem'

const state = {
  totalVestingFundSteem: 0,
  totalVestingShares: 0,
  rewardBalance: 0,
  recentClaims: 0,
  price: 0
}

const getters = {
}

const actions = {
  loadGlobalProperties ({ commit }) {
    Promise.all([
      steem.api.getDynamicGlobalPropertiesAsync(),
      steem.api.getRewardFundAsync('post'),
      steem.api.getCurrentMedianHistoryPriceAsync()
    ]).then(function ([ global, rewardFund, price ]) {
      const base = parseFloat(price.base.split(' ')[0])
      const quote = parseFloat(price.quote.split(' ')[0])
      commit('setGlobalProperties', {
        totalVestingFundSteem: parseFloat(global.total_vesting_fund_steem.split(' ')[0]),
        totalVestingShares: parseFloat(global.total_vesting_shares.split(' ')[0]),
        rewardBalance: parseFloat(rewardFund.reward_balance.split(' ')[0]),
        recentClaims: rewardFund.recent_claims,
        price: (base / quote)
      })
    })
  }
}

const mutations = {
  setGlobalProperties (state, global) {
    for (const key in global) {
      state[key] = global[key]
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
