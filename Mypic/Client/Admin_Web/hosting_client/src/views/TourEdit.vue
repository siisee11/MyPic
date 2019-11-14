<template>
  <v-container>
    <tour-form v-model="tourDoc"></tour-form>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import TourForm from '../components/TourForm'
import tourDocMixin from '../mixins/TourDoc'
import timestampToString from '../utils/FSTimestampToString'

export default {
  mixins: [ tourDocMixin, ],  // Access tour document form as this.tourDoc, as it's defined in data()
  components: {
    TourForm: TourForm
  },
  mounted () {
    firebase.firestore().collection('Tour').doc(this.$route.params.doc_id).onSnapshot((documentSnapshot) => {
      const document = documentSnapshot.data()
      try {
        document.tourStartedAt = timestampToString(document.tourStartedAt)
        document.tourEndedAt = timestampToString(document.tourEndedAt)
      } catch (e) {
        document.tourStartedAt = new Date().toISOString().split('T')[0]
        document.tourEndedAt = new Date().toISOString().split('T')[0]
      }
      this.tourDoc = document
    })
  }
}
</script>