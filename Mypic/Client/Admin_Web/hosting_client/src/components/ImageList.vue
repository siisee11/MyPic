<template>
  <v-row>
    <v-col cols="12" sm="10" offset-sm="1">
      <v-container fluid>
        <v-row>
          <v-col
            v-for="(item, index) in value"
            :key="index"
            class="d-flex child-flex"
            cols="4"
          >
            <v-card flat tile class="d-flex">
              <v-img
                :src="item"
                aspect-ratio="1"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import infiniteScrollMixin from '../mixins/InfiniteScroll'

export default {
  props: ['value', ],
  mixins: [ infiniteScrollMixin, ],
  data () {
    return {
      images: []
    }
  }
}
</script>