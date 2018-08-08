<template>
  <div>
      <template v-for="c in comments">
        <v-layout :key="c.id">
          <v-flex v-if="c.depth > 1" xs1>
            <span class='depth'></span>
          </v-flex>
          <v-flex>
            <v-card flat style='padding:0' class='comments'>
              <v-card-title class="grey--text pb-1">
                {{ c.author }} 
                <span class='reputation pl-1 pr-1'>({{c.author_reputation | filterReputation}})</span>
                · {{c.created | filterCreated}}
              </v-card-title>
              <v-card-text class='pt-0 pb-0 overflow-hidden' v-html='c.body'></v-card-text>
              <v-card-actions class='pr-3'>
                <v-btn small flat><v-icon left dark class='mr-2'>favorite_border</v-icon> 좋아요 ({{c.net_votes}})</v-btn>
                <v-spacer></v-spacer>
                <!-- <v-btn small flat><v-icon left dark>comment</v-icon> 댓글달기</v-btn> -->
                <strong>${{ c.payout_value }}</strong>
              </v-card-actions>
            </v-card>
            <v-divider></v-divider>
            <Comments :comments='c.comments'></Comments>
          </v-flex>
        </v-layout>
      </template>
  </div>
</template>
<script>
export default {
  name: 'Comments',
  props: ['comments']
}
</script>
<style>
.overflow-hidden {
  overflow: hidden;
  word-wrap: break-word;
}
.depth {
  border-left: 5px solid #eee;
  height: calc(100% - 20px);
  display: block;
  margin: 10px 0 10px 10px;
}
</style>