<template>
  <div :id="id" v-html="svg">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

/**
 * Verovio component
 *
 * @module components/VerovioComponent
 * @vue-prop {String} id - id of div-container
 * @vue-prop {String} url - url of MEI to display
 * @vue-data {String} svg - SVG or HTML content to display
 * @vue-computed {Object} options - Verovio options
 */
export default {
  name: 'VerovioComponent',
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      svg: '<span>...|||III|||...</span>'
    }
  },
  mounted () {
    this.loadMEI()
  },
  watch: {
    url () {
      this.loadMEI()
    }
  },
  computed: {
    ...mapGetters(['vrvRender']),
    options () {
      const opts = {}
      opts.scale = 30
      return opts
    }
  },
  methods: {
    /**
     * render MEI identified by URL
     */
    loadMEI () {
      if (this.url && this.url.length > 0) {
        axios.get(this.url).then(({ data }) => {
          this.svg = this.vrvRender(data, this.options)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
