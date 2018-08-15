import steem from 'steem'

const state = {
  username: window.sessionStorage.getItem('username') || '',
  password: window.sessionStorage.getItem('password') || '',
  account: {
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
}

const getters = {
  // isLogin: state => !!state.username,
  isLogin: state => {
    return !!state.username
  }
}

const actions = {
  login ({ commit }, auth) {
    commit('login', auth)
    window.sessionStorage.setItem('username', auth.username)
    window.sessionStorage.setItem('password', auth.password)
  },
  async loadAccount ({ commit, state }) {
    console.log('username:', state.username)
    const [ account ] = await steem.api.getAccountsAsync([state.username])
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
  login (state, { username, password }) {
    state.username = username
    state.password = password
  },
  setAccount (state, account) {
    // console.log('account:', account)
    state.account = account
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
