<template>
  <v-container>
    <v-card>
      <tour-form v-model="tourDoc" page_title="Tour Edit"></tour-form>
      <v-row class="justify-end">
        <v-col xs="2" sm="2" cols="2">
          <v-btn class="mx-3" large text @click="$router.go(-1)">
            Cancel
          </v-btn>
        </v-col>
        <v-col xs="2" sm="2" cols="2">
          <v-btn class="mx-3" color="primary" large text @click="updateTourDoc()">
            Submit
          </v-btn>
        </v-col>
        <v-col xs="0" sm="1" cols="2">
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import TourForm from '@/components/TourForm'
import tourDocMixin from '@/mixins/TourDoc'

export default {
  mixins: [ tourDocMixin, ],  // Access tour document form as this.tourDoc, this.timestampDoc
  components: {
    TourForm: TourForm
  },
  mounted () {
    firebase.firestore().collection('Tour').doc(this.$route.params.doc_id).onSnapshot((documentSnapshot) => {
      const document = documentSnapshot.data()
      this.tourDoc = document
    })
  },
  methods: {
    updateTourDoc: function () {
      this.tourDoc.editedAt = new Date()
      firebase.firestore().doc(`/Tour/${this.$route.params.doc_id}`).update(this.tourDoc).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>