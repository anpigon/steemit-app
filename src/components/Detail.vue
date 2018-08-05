<template>
<v-container fill-height fluid grid-list-md>
  <v-layout>
    <v-flex xs12 md8 offset-md2> 
      <v-card>
        <v-card-title class="headline pb-0">
          {{ title }}
        </v-card-title>
        <v-layout>
          <v-flex xs6>
            <v-list class='pt-0'>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                <img :src="'https://steemitimages.com/u/' + author + '/avatar'" alt="avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ author }} ({{author_reputation}})</v-list-tile-title>
                  <v-list-tile-sub-title>{{created}}분전 · {{category}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
          <v-flex text-xs-right class='pr-4 pt-3'>
            <div>좋아요 {{ net_votes }}명 · 댓글 {{ children }}명</div>
            <strong>${{ payout_value }}</strong>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <p>{{ body }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>
<script>
import steem from 'steem'

export default {
  data () {
    return {
      title: '',
      body: '',
      author: '',
      author_reputation: 0,
      category: '',
      children: 0,
      net_votes: 0,
      created: '',
      payout_value: ''
    }
  },
  // computed: {
  //   author () {
  //     return this.$route.params.author
  //   }
  // },
  deactivated () {
    this.$destroy()
  },
  beforeCreate () {
    const author = this.$route.params.author
    const permlink = this.$route.params.permlink
    steem.api.getContentAsync(author, permlink)
      .then(r => {
        console.log(r)
        this.title = r.title
        this.body = r.body
        this.category = r.category
        this.children = r.children
        this.net_votes = r.net_votes
        this.author = r.author
        this.created = r.created
        this.author_reputation = r.author_reputation
        this.payout_value = 0
      })
      .catch(e => console.log(e))
  }
}
</script>