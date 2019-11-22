<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto py-1 px-4" tile>
          <v-list two-line>
            <v-subheader>Tour List</v-subheader>
            <v-list-item-group v-model="numberOfRenderItems" color="primary">
              <v-list-item
                v-for="(doc, i) in tourDocuments"
                :key="i"
                @click="editTourDoc(doc)"
              >
                <v-list-item-avatar>
                  <v-img :src="doc.get('thumbnail')"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="doc.get('tourName')"></v-list-item-title>
                  <v-list-item-subtitle v-html="stringifyDocMetadata(doc)"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-list-item @click="createTourDoc()">
              <v-list-item-avatar/>
              <v-list-item-content>
                <v-list-item-subtitle> + Create Tour</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
import timestampToString from '@/utils/FSTimestampToString'
import infiniteScrollMixin from '@/mixins/InfiniteScroll'

export default {
  mixins: [infiniteScrollMixin, ],
  data () {
    return {
      tourDocuments: []
    }
  },
  mounted () {
    firebase.firestore().collection('Tour').onSnapshot((snapshot) => {
      this.tourDocuments = snapshot.docs
    })
  },
  computed: {
    // queriedTours: function () {}
    renderingTours: function () {
      return this.tourDocuments.slice(0, this.numberOfRenderItems)
    }
  },
  methods: {
    stringifyDocMetadata: function (doc) {
      const startDate = doc.get('tourStartedAt')
      const endDate = doc.get('tourEndedAt')
      const location = doc.get('location')

      return `${location}, ${timestampToString(startDate)} ~ ${timestampToString(endDate)}`
    },
    createTourDoc: function () {
      this.$router.push({ path: `/tourcreate` })
    },
    editTourDoc: function (doc) {
      this.$router.push({ path: `/touredit/${doc.id}` })
    }
  }
}
</script>

<style>

</style>