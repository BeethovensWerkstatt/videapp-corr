<template>
  <div :id="id" v-html="html" :class="status">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { startProc, finishProc } from '@/store'

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
 * @vue-computed {String} status - one of `verovio`, `processing` and `error`
 * @vue-computed {String} html - html content for component
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
      svg: null,
      mei: null,
      error: null
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
    status () {
      if (this.error) {
        return 'error'
      }
      if (this.svg) {
        return 'verovio'
      }
      return 'processing'
    },
    html () {
      if (this.error) {
        return this.error
      }
      if (this.svg) {
        return this.svg
      }
      return '<span title="' + this.url + '">... lade ...</span>'
    },
    url () {
      return this.options ? this.options.url : 'demo.mei'
    },
    page () {
      return this.options && this.options.page > 1 ? this.options.page : 1
    },
    scale () {
      return this.options && this.options.scale > 0 ? this.options.scale : 30
    },
    height () {
      return this.options && this.options.height > 0 ? this.options.height : 0
    },
    width () {
      var width = this.options && this.options.width > 0 ? this.options.width : 0
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
      if (this.option && this.options.from) {
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
        startProc()
        console.log('load', this.url)
        this.svg = null
        axios.get(this.url).then(({ data }) => {
          this.mei = data
          if (this.mei) {
            if (!this.toolkit) {
              this.toolkit = this.vrvToolkit()
            }
            this.toolkit.setOptions(this.vrvOptions)
            this.toolkit.loadData(this.mei)
            this.renderMEI()
            this.error = null
          }
        }).catch(error => {
          this.error = '<span title="' + this.url + '">' + error.message + '</span>'
        }).finally(() => {
          finishProc()
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
        startProc()
        // console.log(this.toolkit.getPageCount())
        this.svg = null
        var svg = this.toolkit.renderToSVG(this.page, this.vrvOptions)
        this.svg = svg
        finishProc()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.verovio {
  border: 1px solid yellow;
  background-color: whitesmoke;
}
.processing {
  border: 1px solid blue;
  background-color: grey;
}
.error {
  border: 1px solid red;
  background-color: yellow;
  border-radius: 5px;
}
</style>
