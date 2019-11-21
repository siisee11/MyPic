<template>
  <v-container>
    <v-card>
      <tour-form v-model="tourDoc" page_title="Tour Create" :doc_id="docId"></tour-form>
      <image-uploader/>
      <v-row class="justify-end">
        <v-col xs="2" sm="2" cols="2">
          <v-btn class="mx-3" large text @click="$router.go(-1)">
            Cancel
          </v-btn>
        </v-col>
        <v-col xs="2" sm="2" cols="2">
          <v-btn class="mx-3" color="primary" large text @click="createTourDoc()">
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
import autoId from '@/utils/FirestoreNewId'
import TourForm from '@/components/TourForm'
import FirebaseStorageImageUploader from '@/components/FirebaseStorageUploader'
import tourDocMixin from '@/mixins/TourDoc'

export default {
  mixins: [ tourDocMixin, ],  // Access tour document form as this.tourDoc
  data () {
    return {
      docId: autoId()
    }
  },
  components: {
    TourForm: TourForm,
    ImageUploader: FirebaseStorageImageUploader
  },
  methods: {
    createTourDoc: function () {
      firebase.firestore().collection('Tour').doc().set(this.tourDoc).then(() => {
        this.$router.go(-1)
      }).catch((error) => {
        alert(error)
      })
    }
  }
}
</script>

<style>

</style>