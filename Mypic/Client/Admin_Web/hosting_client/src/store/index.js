/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import router from '@/router'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'Mypic',
    user: null,
    uid: null,
    error: null,
    loading: false
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setUID(state, payload) {
      state.uid = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    userSignIn({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then()
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    autoSignIn({ commit }, payload) {
      firebase.firestore().collection('Info').doc(payload.uid)
        .get().then((documentSnapshot) => {
          if (documentSnapshot.data().isAdmin === true || documentSnapshot.data().admin === true) {
            commit('setUser', { email: documentSnapshot.data().email })
            commit('setUID', { uid: payload.uid })
            commit('setLoading', false)
            commit('setError', null)
            router.push('/home')
          }
          else {
            firebase.auth().signOut()
            commit('setUser', null)
            commit('setUID', null)
            commit('setError', 'Not Authorized Access')
            commit('setLoading', false)
          }
        })
    },
    userSignOut({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('setUID', null)
      router.push('/')
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined
    },
    getUid(state) {
      return state.uid
    }
  }
})