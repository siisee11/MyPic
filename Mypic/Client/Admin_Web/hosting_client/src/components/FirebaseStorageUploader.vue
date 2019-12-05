<template>
  <v-card>
    <v-row align="center" justify="center" pa-3>
      <v-col sm="6" cols="6">
        <v-subheader>
          {{ label }}
        </v-subheader>
      </v-col>
      <v-col sm="4" cols="4" mt-4 mx-3>
        <v-file-input v-model="tourImages" label="Upload..." accept="image/jpg" multiple flat/>
      </v-col>
      <v-col sm="12" cols="12">
        <image-list v-model="value"/>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ImageList from '@/components/ImageList'
import firebase from 'firebase/app'
import 'firebase/storage'

export default {
  props: ['value', 'label', 'path'],
  components: {
    ImageList: ImageList
  },
  data () {
    return {
      tourImages: null
    }
  },
  methods: {
    upload_GetURL_doThis: async function (path, file, func) {
      var uploadsnapshot = await firebase.storage().ref(path).put(file)
      var url = await uploadsnapshot.ref.getDownloadURL()
      func(url)
    }
  },
  watch: {
    tourImages: async function (val) {
      for (let i = 0; i < val.length; i++) {
        const file = val[i]
        this.upload_GetURL_doThis(`/tour_images/${this.doc_id}/${file.name}`, file, (url) => {
          this.value.images.push(url)
        })
      }
    }
  }
}
</script>

<style>

</style>