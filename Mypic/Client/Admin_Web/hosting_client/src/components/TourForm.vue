<template>
  <v-container fluid>
    <v-row align="center" justify="center" no-gutters>
      <v-col sm="10" cols="12">
        <h1 class="my-6"> {{ page_title }} </h1>
      </v-col>

      <v-col sm="4" cols="12">
        <v-img class="pa-2 ma-2" :src="value.thumbnail"/>
        <v-file-input v-model="thumbnailFile" label="Thumbnail" accept="image/jpg" flat/>
      </v-col>

      <v-col sm="6" cols="12">
        <v-col xs="12" cols="12">
          <v-text-field 
            v-model="value.tourName"
            label="Tour Name"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field 
            v-model="value.location"
            label="Location"
          ></v-text-field>
        </v-col>
      </v-col>

      <v-col sm="10" cols="12">
        <v-textarea
          v-model="value.description"
          label="Tour Description"
          single-line
          class="pa-3"
        ></v-textarea>
      </v-col>

      <v-col sm="5" cols="12">
        <text-date-picker v-model="startedAt" label="Start date"/>
      </v-col>
      <v-col sm="5" cols="12">
        <text-date-picker v-model="endedAt" label="End Date"/>
      </v-col>

      <v-col sm="10" cols="12">
        <user-selector v-model="value.participants"/>
      </v-col>

      <v-col sm="10" cols="12">
        <image-uploader v-model="value.images" label="Tour Images" :path="`/tour_images/${this.doc_id}/`"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TextDatePicker from './TextDatePicker'
import timestampToString from '../utils/FSTimestampToString'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { isNullOrUndefined } from 'util'
import FirebaseStorageImageUploader from '@/components/FirebaseStorageUploader'
import FirebaseUserSelector from '@/components/FirebaseUserSelector'


export default {
  props: ['value', 'page_title', 'doc_id'],
  components: {
    textDatePicker: TextDatePicker,
    imageUploader: FirebaseStorageImageUploader,
    userSelector: FirebaseUserSelector
  },
  data () {
    return {
      thumbnailFile: null
    }
  },
  computed: {
    startedAt: {
      get: function () {
        return timestampToString(this.value.tourStartedAt)
      },
      set: function (val) {
        this.value.tourStartedAt = firebase.firestore.Timestamp.fromDate(new Date(val))
      }
    },
    endedAt: {
      get: function () {
        return timestampToString(this.value.tourEndedAt)
      },
      set: function (val) {
        this.value.tourEndedAt = firebase.firestore.Timestamp.fromDate(new Date(val))
      }
    }
  },
  methods: {
    upload_GetURL_doThis: async function (path, file, func) {
      var uploadsnapshot = await firebase.storage().ref(path).put(file)
      var url = await uploadsnapshot.ref.getDownloadURL()
      func(url)
    },
  },
  watch: {
    thumbnailFile: async function (val) {
      if (!isNullOrUndefined(val)) {
        this.upload_GetURL_doThis(`/tour_images/${this.doc_id}/thumbnail.jpg`, val, (url) => {
          this.value.thumbnail = url
        })
      }
    }
  }
}
</script>

<style>

</style>