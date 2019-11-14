<template>
  <v-container>
    <tour-form v-model="tourDoc"></tour-form>
  </v-container>
</template>

<script>
import TourForm from '../components/TourForm'
import tourDocMixin from '../mixins/TourDoc'

export default {
  mixins: [ tourDocMixin, ],  // Access tour document form as this.tourDoc
  components: {
    TourForm: TourForm
  }
}
</script>

<style>

</style>