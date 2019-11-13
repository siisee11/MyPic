import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {store} from './store'
import router from './router'

import firebase from 'firebase/app'
import { firebaseConfig } from '../firebaseconfig'
import Toasted from 'vue-toasted'

Vue.config.productionTip = false
firebase.initializeApp(firebaseConfig)

Vue.use(Toasted)

/* eslint-disable no-new */
const unsubscribe = firebase.auth()
.onAuthStateChanged(() => {
  new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    render: h => h(App),
    created () {
      firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          store.dispatch('autoSignIn', firebaseUser)
        }
      })
    }
  })
  unsubscribe()
})
