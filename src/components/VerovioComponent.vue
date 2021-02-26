<template>
  <div :id="id" v-html="svg" class="verovio">
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
 * @vue-prop {Object} options - needs at least property url
 * @vue-data {Object} [toolkit=null] - the Verovio toolkit
 * @vue-data {String} [svg=...] - SVG or HTML content to display
 * @vue-data {String} [mei=null] - loaded MEI (or other format)
 * @vue-computed {String} url - taken from options
 * @vue-computed {Number} scale - taken from options (default: 30)
 * @vue-computed {Number} page - taken from options (default: 1)
 * @vue-computed {Number} width - taken from options (default: element width)
 * @vue-computed {Number} height - taken from options (default: 0)
 * @vue-computed {Number} pageWidth - Verovio page width (calculated from element-width if width=0)
 * @vue-computed {Number} pageHeight - Verovio page height
 * @vue-computed {Object} vrvOptions - Verovio options
 */
export default {
  name: 'VerovioComponent',
  props: {
    id: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      toolkit: null,
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
      this.redoLayout()
      this.renderMEI()
    },
    width () {
      this.redoLayout()
      this.renderMEI()
    },
    page () {
      this.renderMEI()
    }
  },
  computed: {
    ...mapGetters(['vrvToolkit']),
    url () {
      return this.options.url
    },
    page () {
      return this.options.page > 1 ? this.options.page : 1
    },
    scale () {
      return this.options.scale > 0 ? this.options.scale : 30
    },
    width () {
      return this.options.width > 0 ? this.options.width : 0
    },
    height () {
      var width = this.options.height > 0 ? this.options.height : 0
      if (width === 0 && this.$el) {
        width = this.$el.clientWidth
      }
      return width
    },
    pageWidth () {
      const width = this.width > 0 ? this.width : this.$el.clientWidth
      return Math.max(100, width * 100 / this.scale)
    },
    pageHeight () {
      if (this.height > 0) {
        return this.height * 100 / this.scale
      }
      return 0
    },
    vrvOptions () {
      const opts = {}
      opts.scale = this.scale
      opts.pageWidth = this.pageWidth
      if (this.pageHeight > 0) {
        opts.pageHeight = this.pageHeight
      }
      opts.adjustPageHeight = true
      if (this.options.from) {
        opts.from = this.options.from
      }
      return opts
    }
  },
  methods: {
    /**
     * load MEI identified by URL
     */
    loadMEI () {
      if (this.url && this.url.length > 0) {
        this.$store.commit('SET_WORKING', true)
        axios.get(this.url).then(({ data }) => {
          this.mei = data
          if (this.mei) {
            if (!this.toolkit) {
              this.toolkit = this.vrvToolkit()
            }
            this.toolkit.setOptions(this.vrvOptions)
            this.toolkit.loadData(this.mei)
            this.renderMEI()
            this.$store.commit('SET_WORKING', false)
          }
        }).catch(error => {
          this.svg = '<div class="error">' + error.message + '</div>'
          this.$store.commit('SET_WORKING', false)
        })
      }
    },
    /**
     * recalculate layout
     */
    redoLayout () {
      if (this.toolkit) {
        this.toolkit.redoLayout()
      }
    },
    /**
     * render MEI in `mei` data
     */
    renderMEI () {
      const mei = this.mei
      if (this.toolkit && mei && mei.length > 0) {
        this.$store.commit('SET_WORKING', true)
        // console.log(this.toolkit.getPageCount())
        var svg = this.toolkit.renderToSVG(this.page, this.vrvOptions)
        this.svg = svg
        this.$store.commit('SET_WORKING', false)
      }
    }
  }
}
</script>

<style scoped>
.verovio {
  border: 1px solid yellow;
  background-color: whitesmoke;
}
</style>
