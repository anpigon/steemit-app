<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
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
    <v-toolbar color="teal accent-4" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Steemlog</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat small>로그인</v-btn>
    </v-toolbar>
    <v-content>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </v-content>
    <!-- <v-footer color="indigo" app>
      <span class="white--text ml-3"><a href='https://steemit.com/@anpigon' class="white--text">@anpigon</a> &copy; 2018</span>
    </v-footer> -->
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: false
    }),
    props: {
      source: String
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