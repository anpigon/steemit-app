<template>
  <v-layout column>
    <v-flex xs12 sm8 offset-sm2> 
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 v-for="idx in 3" :key="idx">
            <v-card>
              <v-list two-line class='pt-0 pb-0'>
                <v-list-tile>
                  <v-list-tile-avatar>
                  <img src="https://steemitimages.com/u/anpigon/avatar" alt="avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>anpigon (55)</v-list-tile-title>
                    <v-list-tile-sub-title>11시간 · KR</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-card-media
                src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                height="200px"></v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                  <div>Located two hours south of Sydney in the Southern Highlands of New South Wales, ...</div>
                </div>
              </v-card-title>
              <v-card-title>
                좋아요 5명 · 댓글 5명
                <v-spacer></v-spacer>
                <strong>$774.32</strong>
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
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>

</script>