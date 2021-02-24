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
 * @vue-computed {Number} pageWidth - Verovio page width
 * @vue-computed {Number} pageHeight - Verovio page height
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
    from: {
      type: String,
      default: null
    },
    scale: {
      type: Number,
      default: 30
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
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
    pageWidth () {
      const width = this.width > 0 ? this.width : this.$el.clientWidth
      return width * 100 / this.scale
    },
    pageHeight () {
      if (this.height > 0) {
        return this.height * 100 / this.scale
      }
      return 0
    },
    options () {
      const opts = {}
      opts.scale = this.scale
      opts.pageWidth = this.pageWidth
      if (this.pageHeight > 0) {
        opts.pageHeight = this.pageHeight
      }
      opts.adjustPageHeight = true
      if (this.from) {
        opts.from = this.from
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
        axios.get(this.url).then(({ data }) => {
          this.mei = data
          if (this.mei) {
            if (!this.toolkit) {
              this.toolkit = this.vrvToolkit()
            }
            this.toolkit.setOptions(this.options)
            this.toolkit.loadData(this.mei)
            this.renderMEI()
          }
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
        const page = this.page > 0 ? this.page : 1
        // console.log(this.toolkit.getPageCount())
        var svg = this.toolkit.renderToSVG(page, this.options)
        this.svg = svg
      }
    }
  }
}
</script>

<style scoped>
</style>
