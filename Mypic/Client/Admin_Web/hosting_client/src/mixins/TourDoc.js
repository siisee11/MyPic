export default {
    data () {
      return {
        tourDoc: {
          createdAt: new Date(),
          editedAt: new Date(),
          description: '',
          images: [],
          location: '',
          participants: [],
          thumbnail: '',
          tourEndedAt: null,
          tourName: '',
          tourStartedAt: null
        }
      }
    }
  }
  