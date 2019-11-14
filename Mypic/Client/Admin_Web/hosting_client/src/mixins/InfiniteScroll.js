export default {
    data () {
      return {
        numberOfRenderItems: 10
      }
    },
    mounted () {
      this.scroll()
    },
    methods: {
      scroll () {
        window.onscroll = () => {
          let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
  
          if (bottomOfWindow) {
            this.numberOfRenderItems += 10
          }
        }
      }
    }
  }
  