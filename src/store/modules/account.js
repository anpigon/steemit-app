import steem from 'steem'

const state = {
  username: '',
  name: '',
  profileImage: '',
  coverImage: '',
  about: '',
  reputation: 0,
  postCount: 0,
  lastVoteTime: '',
  votingPower: 0,
  vestingShares: 0,
  delegatedVestingShares: 0,
  receivedVestingShares: 0
}

const getters = {
}

const actions = {
  async loadAccount ({ commit }, username) {
    const [ account ] = await steem.api.getAccountsAsync([username])
    const { profile } = JSON.parse(account.json_metadata)
    console.log('account', account, profile)

    const data = {
      name: profile.name,
      coverImage: profile.cover_image,
      profileImage: profile.profile_image,
      about: profile.about,
      reputation: steem.formatter.reputation(account.reputation), // 명성도
      postCount: account.post_count, // 포스트 갯수
      lastVoteTime: account.last_vote_time,
      votingPower: account.voting_power,
      vestingShares: parseFloat(account.vesting_shares.split(' ')[0]),
      delegatedVestingShares: parseFloat(account.delegated_vesting_shares.split(' ')[0]),
      receivedVestingShares: parseFloat(account.received_vesting_shares.split(' ')[0])
    }

    commit('setAccount', data)
  }
}

const mutations = {
  setAccount (state, account) {
    // console.log('account:', account)
    for (const key in account) {
      state[key] = account[key]
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
