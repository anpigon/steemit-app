<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      app
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="teal accent-4" dark fixed app v-show='isMainComponent'>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>Steemlog</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- <router-link flat v-if='username' :to="'/@' + username + '/feed'">피드</router-link> -->
        <v-btn flat v-if='username' @click="$router.push('/@' + username + '/feed')">피드</v-btn>
        <v-btn flat @click="$router.push('/created')">최신글</v-btn>
        <v-btn flat @click="$router.push('/hot')">인기글</v-btn>
        <v-btn flat @click="$router.push('/trending')">대세글</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if='!username'>
        <v-btn flat small to='/login'>로그인</v-btn>
      </v-toolbar-items>
      <v-btn v-if='username' icon>
        <v-avatar color="white" size='36'>
          <img :src="'https://steemitimages.com/u/' + username + '/avatar'" alt="avatar" onerror="this.src='https://steemitimages.com/u/monawoo/avatar/small'">
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-toolbar fixed app v-show='!isMainComponent'>
      <v-toolbar-side-icon @click.stop="$router.go(-1)"><v-icon>arrow_back_ios</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="ml-0">뒤로가기</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <transition name="fade" mode="out-in" appear>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </v-content>
    <!-- <v-footer color="indigo" app>
      <span class="white--text ml-3"><a href='https://steemit.com/@anpigon' class="white--text">@anpigon</a> &copy; 2018</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    drawer: false
  }),
  props: {
    source: String
  },
  computed: {
    ...mapState('auth', [
      'username'
    ]),
    isMainComponent () {
      return !!this.$route.meta.main
    }
  },
  // watch: {
  //   '$route' (to, from) {
  //     console.log('to:', to, '\nfrom:', from)
  //   }
  // },
  created () {
    console.log('App.vue created => Main:', this.isMainComponent)
    console.log(this.$route)
  }
}
</script>

<style>
.reputation {
  font-size: 13px;
  font-size: 0.8125rem;
  line-height: 1;
  padding: 0;
  margin-left: -1px;
  font-weight: normal;
  transition: 0.3s all ease-in-out;
}
</style>