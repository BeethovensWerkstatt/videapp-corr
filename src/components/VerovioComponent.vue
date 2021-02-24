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
    },
    scale: {
      type: Number,
      default: 30
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      svg: '<span>...|||III|||...</span>',
      mei: null
    }
  },
  mounted () {
    this.loadMEI()
  },
  watch: {
    url () {
      this.loadMEI()
    },
    scale () {
      this.renderMEI()
    },
    width () {
      this.renderMEI()
    }
  },
  computed: {
    ...mapGetters(['vrvRender']),
    options () {
      const opts = {}
      opts.scale = this.scale
      opts.pageWidth = this.width * 100 / this.scale
      if (this.height > 0) {
        opts.pageHeight = this.height * 100 / this.scale
      }
      opts.adjustPageHeight = true
      return opts
    }
  },
  methods: {
    /**
     * load MEI identified by URL
     */
    loadMEI () {
      if (this.url && this.url.length > 0) {
        axios.get(this.url).then(({ data }) => {
          this.mei = data
          this.renderMEI()
        })
      }
    },
    /**
     * render MEI in `mei` data
     */
    renderMEI () {
      const mei = this.mei
      if (mei && mei.length > 0) {
        this.svg = this.vrvRender(mei, this.options)
      }
    }
  }
}
</script>

<style scoped>
</style>
