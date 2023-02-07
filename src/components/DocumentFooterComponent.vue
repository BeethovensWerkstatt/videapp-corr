<template>
  <div
    class="document-footer"
    :id="divid"
  >
    <div
      class="bottom-title"
      :style="{ left: marginPerc + '%', width: titlePerc + '%' }"
      id="draghandle-footer"
    >
      <div class="title">
        <div v-if="source.pages[pagenr].v" :style="footerStyleVerso">
          <template v-if="sourceURLVerso">
            <a :href="sourceURLVerso" target="_blank" :title="sourceDescVerso" @click="window.open(sourceURLVerso, '_blank')">{{ sourceLabelVerso }}</a>
          </template>
          <template v-else-if="sourceLabelVerso">
            {{ sourceLabelVerso }}
          </template>
        </div>
        <div v-if="source.pages[pagenr].r" :style="footerStyleRecto">
          <template v-if="sourceURLRecto">
            <a :href="sourceURLRecto" target="_blank" :title="sourceDescRecto" @click="window.open(sourceURLRecto, '_blank')">{{ sourceLabelRecto }}</a>
          </template>
          <template v-else-if="sourceLabelRecto">
            {{ sourceLabelRecto }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'

const sourceLabel = (labels) => {
  if (labels) {
    let label = labels.names[0].label
    if (labels.names[0].page) label += ' [' + labels.names[0].page + ']'
    return label
  }
  return undefined
}
const sourceDesc = (labels) => {
  if (labels) {
    let label = labels.names[0].desc
    if (labels.names[0].page) label += ' [' + labels.names[0].page + ']'
    return label
  }
  return undefined
}

/**
 * @module components/DocumentFooterComponent
 * @vue-prop {String} sourceId id of source object
 */
export default {
  components: {},
  name: 'DocumentFooterComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    const viewer = this.$store.getters.viewer
    const background = viewer.world.getItemAt(0)
    let scale = background?.viewportToImageZoom(viewer.viewport.getZoom())
    if (!scale) {
      scale = 1
    }
    return {
      position_: { ...this.$store.getters.getSourceById(this.sourceId).position },
      tracker: null,
      dragDelta: null,
      scale,
      window
    }
  },
  // TODO before destroy cleanup: remove Overlay, remove handlers
  mounted () {
    // create overlay for footer bar
    if (this.viewer) {
      this.viewer.addOverlay({
        element: this.$el,
        location: this.position
      }, this.position, OpenSeadragon.TOP_CENTER)
      this.viewer.addHandler('zoom', this.doResize)
    }
    // console.log(this.position, this.dragHandle)
  },
  watch: {
    position () {
      // console.log(this.position)
      this.updatePosition()
    }
  },
  computed: {
    ...mapGetters(['viewer', 'sourceFooterHeight', 'sourceMarginWidth', 'getSourceById', 'getCanvasLabels']),
    divid () {
      return this.sourceId + '_footer'
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
    marginPerc () {
      return (100 * this.sourceMarginWidth / this.position.width)
    },
    titlePerc () {
      return 100 - (2 * this.marginPerc)
    },
    dragHandle () {
      return this.$el.querySelector('#draghandle-footer')
    },
    source () {
      const source = this.getSourceById(this.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      console.warn('no source for ' + this.sourceId + '!')
      return {
        pages: [{ v: null, r: null }],
        position: { x: 0, y: 0 }
      }
    },

    sourceNameRecto () {
      const page = this.source.pages[this.pagenr].r
      return this.getCanvasLabels(page?.id)
    },
    sourceNameVerso () {
      const page = this.source.pages[this.pagenr].v
      return this.getCanvasLabels(page?.id)
    },

    sourceLabelRecto () {
      return sourceLabel(this.sourceNameRecto) || '[verschollen]'
    },
    sourceDescRecto () {
      return sourceDesc(this.sourceNameRecto) || '[verschollen]'
    },
    sourceURLRecto () {
      return this.sourceNameRecto?.names[0].url
    },
    sourceLabelVerso () {
      return sourceLabel(this.sourceNameVerso) || '[verschollen]'
    },
    sourceDescVerso () {
      return sourceDesc(this.sourceNameVerso) || '[verschollen]'
    },
    sourceURLVerso () {
      return this.sourceNameVerso?.names[0].url
    },

    pagenr () {
      const pnr = +this.source.pagenr
      if (this.checkPageNr(pnr)) {
        return pnr
      }
      if (this.checkPageNr(this.defaultPage)) {
        return this.defaultPage
      }
      return 0
    },
    rectopage () {
      const page = this.source.pages[this.pagenr]
      const labels = this.getCanvasLabels(page?.r?.id)
      return labels?.page || page.r?.label || ''
    },
    versopage () {
      const page = this.source.pages[this.pagenr]
      const labels = this.getCanvasLabels(page?.v?.id)
      return labels?.page || page.v?.label || ''
    },
    footerStyle () {
      const zoom = this.viewer.viewport.getZoom(true)
      const scale = this.viewer.viewport._containerInnerSize.x * zoom
      // console.log('header scale', scale)
      return {
        'font-size': scale * this.sourceFooterHeight * 0.7 + 'px'
      }
    },
    footerStyleRecto () {
      const width = (this.versopage) ? '50%' : '100%'
      const display = (this.rectopage) ? 'inline-block' : 'none'
      return ({ ...this.footerStyle, 'text-align': 'right', 'padding-right': '5pt', display, width })
    },
    footerStyleVerso () {
      const width = (this.rectopage) ? '50%' : '100%'
      const display = (this.versopage) ? 'inline-block' : 'none'
      return ({ ...this.footerStyle, 'text-align': 'left', 'padding-left': '5pt', display, width })
    }
  },
  methods: {
    updatePosition () {
      if (this.overlay) {
        this.overlay.update(this.position)
      }
    },
    doResize (e) {
      const zoom = this.viewer.world.getItemAt(0).viewportToImageZoom(e.zoom)
      // console.log(zoom)
      this.scale = zoom * 2
    },
    /**
     * check if page number is in range
     * @param {Number} pnr - page number to check
     * @returns {Boolean} true if `pnr` is in range
     */
    checkPageNr (pnr) {
      return (pnr >= 0 && pnr < this.source.pages.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.document-footer {
  // outline: 1px solid red;
  padding: 0%;
  margin: 0%;

  .btn {
    width: 100%;
    height: 100%;
    margin: 0%;
    padding: 0%;
  }
  .bottom-title {
    position: absolute;
    height: 100%;
    text-align: center;
    white-space: nowrap;
    // TODO color consts in separate file
    background: linear-gradient(0deg, #dddddd, #ffffff);
    border-radius: 3px;

    .title {
      position: absolute;
      left: 0;
      width: 100%;
      overflow: hidden;
      font-size: 80%;
    }
  }
}

</style>
