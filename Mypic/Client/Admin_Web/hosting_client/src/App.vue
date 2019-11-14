<template>
  <v-app >
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-item-action>
            <v-icon>{{ 'mdi-' + item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isAuthenticated" @click="userSignOut">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Sign Out</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <span class="hidden-md-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar">
        </v-app-bar-nav-icon>
      </span>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }} 
        </router-link>
      </v-toolbar-title>

      <v-spacer/>
        <v-btn
          text
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ 'mdi-' + item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn text v-if="isAuthenticated" @click="userSignOut">
          <v-icon left>mdi-exit-to-app</v-icon>
          Sign Out
        </v-btn>
      
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      // appTitle: 'Awesome App',
      sidebar: false
    }
  },
  computed: {
    appTitle () {
      return this.$store.state.appTitle
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    menuItems () {
      if (this.isAuthenticated) {
        return [  // Search Icons from https://materialdesignicons.com/
          { title: 'Home', path: '/home', icon: 'home' },
          { title: 'Tour', path: '/tourlist', icon: 'format-list-bulleted'}
        ]
      } else {
        return [
          { title: 'Sign In', path: '/signin', icon: 'lock-open' }
        ]
      }
    }
  },
  methods: {
    userSignOut () {
      this.$store.dispatch('userSignOut')
    }
  }
}
</script>
