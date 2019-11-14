<template>
  <v-container fluid>
    <v-row align="center" justify="center" pa-3>
      <v-col xs="12" sm="10" cols="12" ma-3>
        <h1> Create Tour </h1>
      </v-col>

      <v-col xs="12" sm="10" cols="12">
        <v-text-field 
          v-model="value.tourName"
          label="Tour Name"
        ></v-text-field>
      </v-col>

      <v-col xs="12" sm="10" cols="12">
        <v-textarea
          v-model="value.description"
          label="Tour Description"
          single-line
        ></v-textarea>
      </v-col>


    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style>

</style>