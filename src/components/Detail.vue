<template>
<v-container fill-height fluid grid-list-md>
  <v-layout>
    <v-flex xs12 md9 offset-md3> 
      <v-card>
        <v-card-title class="headline pb-0">
          스팀잇(Steemit)기반 앱 만들기 #2 - 최근글 가져오기
        </v-card-title>
        <v-list class='pt-0'>
          <v-list-tile avatar>
            <v-list-tile-avatar size="64" >
            <img :src="'https://steemitimages.com/u/anpigon/avatar'" alt="avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>anpigon (55)</v-list-tile-title>
              <v-list-tile-sub-title>1분전 · kr</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <p>이번 시간에는 스팀잇에 등록된 글을 가져와서 출력하는 화면을 구현하겠습니다.<br>
            저도 학습하면서 구현하는 중이기 때문에 설명이 부족할 수 있습니다.<br>
            양해부탁드립니다.</p>
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
      content: []
    }
  },
  // computed: {
  //   author () {
  //     return this.$route.params.author
  //   }
  // },
  beforeCreate () {
    const author = this.$route.params.author
    const permlink = this.$route.params.permlink
    steem.api.getContentAsync(author, permlink)
      .then(result => console.log(result))
  }
}
</script>