<template>
  <image-list v-model="value" :label="label"/>
</template>

<script>
import ImageList from '@/components/ImageList'

export default {
  props: ['value', 'label', 'firestore_path'],
  components: {
    ImageList: ImageList
  }
}
</script>

<style>

</style>