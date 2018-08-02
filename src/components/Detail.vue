<template>
  <v-card>
    <v-list>
      <v-list-tile avatar>
        <v-list-tile-avatar>
        <img :src="'https://steemitimages.com/u/' + d.author + '/avatar'" alt="avatar">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ d.author }} ({{ d.author_reputation }})</v-list-tile-title>
          <v-list-tile-sub-title>{{ d.created }} · {{ d.category }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>