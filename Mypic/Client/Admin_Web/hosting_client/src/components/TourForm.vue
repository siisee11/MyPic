<template>
  <v-container fluid>
    <v-row align="center" justify="center" no-gutters>
      <v-col xs="12" sm="10" cols="12">
        <h1 class="my-6"> Create Tour </h1>
      </v-col>

      <v-col xs="12" sm="4" cols="12">
        <v-img class="pa-2 ma-2" :src="value.thumbnail"/>
      </v-col>

      <v-col xs="12" sm="6" cols="12">
        <v-col xs="12" cols="12">
          <v-text-field 
            v-model="value.tourName"
            label="Tour Name"
          ></v-text-field>
        </v-col>
        <v-col xs="12" cols="12">
          <v-text-field 
            v-model="value.location"
            label="Location"
          ></v-text-field>
        </v-col>
      </v-col>

      <v-col xs="12" sm="10" cols="12">
        <v-textarea
          v-model="value.description"
          label="Tour Description"
          single-line
          class="pa-3"
        ></v-textarea>
      </v-col>

      <v-col xs="12" sm="5" cols="12">
        <text-date-picker v-model="value.tourStartedAt" label="Start date"/>
      </v-col>
      <v-col xs="12" sm="5" cols="12">
        <text-date-picker v-model="value.tourEndedAt" label="End Date"/>
      </v-col>


    </v-row>
  </v-container>
</template>

<script>
import TextDatePicker from './TextDatePicker'

export default {
  props: ['value'],
  components: {
    textDatePicker: TextDatePicker
  }
}
</script>

<style>

</style>