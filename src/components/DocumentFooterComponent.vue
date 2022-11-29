<template>
  <div
    class="document-footer"
    :class="{ activeSource: active }"
    :id="divid"
  >
    <div class="top-left" :style="{ width: marginPerc + '%' }">
      <flip-page-button-component
        :dir="-1"
        :action="prevPage"
        :enabled="hasPrev"
        :headerStyle="footerStyle"
      />
    </div>
    <div
      class="bottom-title"
      :style="{ left: marginPerc + '%', width: titlePerc + '%' }"
      id="draghandle"
    >
      <div class="pagenr verso">
        <div :style="footerStyle">{{ versopage }}</div>
      </div>
      <div class="pagenr recto">
        <div :style="footerStyle">{{ rectopage }}</div>
      </div>
      <div class="title" :title="source.description">
        <div v-if="source.pages[pagenr].v" :style="footerStyleVerso">{{ sourceLabelVerso }}</div>
        <div v-if="source.pages[pagenr].r" :style="footerStyleRecto">{{ sourceLabelRecto }}</div>
      </div>
    </div>
    <div class="top-right" :style="{ width: marginPerc + '%' }">
      <flip-page-button-component
        :dir="1"
        :action="nextPage"
        :enabled="hasNext"
        :headerStyle="footerStyle"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import { mutations } from '@/store/names'
import FlipPageButtonComponent from './FlipPageButtonComponent.vue'

/**
 * @module components/DocumentFooterComponent
 * @vue-prop {String} sourceId id of source object
 */
export default {
  components: { FlipPageButtonComponent },
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
      scale
    }
  },
  // TODO before destroy cleanup: remove Overlay, remove handlers
  mounted () {
    // create MouseTracker for moving component via drag and drop
    this.tracker = new OpenSeadragon.MouseTracker({
      element: this.dragHandle,
      clickHandler: () => { this.selectSource() },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler,
      releaseHandler: this.dragEndHandler // do we need this?
    })
    // create overlay for title bar
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
    ...mapGetters(['viewer', 'sourceHeaderHeight', 'sourceMarginWidth']),
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
      return this.$el.querySelector('#draghandle')
    },
    source () {
      const source = this.$store.getters.getSourceById(this.sourceId)
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
    sourceLabelRecto () {
      const page = this.source.pages[this.pagenr]
      const labels = this.$store.getters.getPageLabel(page?.r?.id)
      if (labels) {
        const label = `${labels.label} ${labels.sigle} [${labels.pagelabel}]`
        console.log(label)
        return label
      }
      return 'Signatur Recto'
    },
    sourceLabelVerso () {
      const page = this.source.pages[this.pagenr]
      const labels = this.$store.getters.getPageLabel(page?.v?.id)
      console.log(page?.v?.id, labels)
      if (labels) {
        return `${labels.label} ${labels.sigle} [${labels.pagelabel}]`
      }
      return 'Signatur Verso'
    },
    sourcePosition: {
      get () {
        return this.position_
      },
      set (pos) {
        this.position_ = pos
        if (this.overlay) {
          // console.log('move source ' + this.sourceId + ': ' + JSON.stringify(pos))
          this.overlay.update(new OpenSeadragon.Point(this.dashX, this.dashY), OpenSeadragon.TOP_CENTER)
          this.$forceUpdate()
        }
      }
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
      const labels = this.$store.getters.getPageLabel(page?.r?.id)
      if (labels) {
        return labels.page
      }
      return page.r ? page.r.label : ''
    },
    versopage () {
      const page = this.source.pages[this.pagenr]
      const labels = this.$store.getters.getPageLabel(page?.v?.id)
      if (labels) {
        return labels.page
      }
      return page.v ? page.v.label : ''
    },
    hasPrev () {
      return this.checkPageNr(this.pagenr - 1)
    },
    hasNext () {
      return this.checkPageNr(this.pagenr + 1)
    },
    footerStyle () {
      const zoom = this.viewer.viewport.getZoom(true)
      const scale = this.viewer.viewport._containerInnerSize.x * zoom
      // console.log('header scale', scale)
      return {
        'font-size': scale * this.sourceHeaderHeight * 0.7 + 'px'
      }
    },
    footerStyleRecto () {
      const width = (this.pagenr === this.source.pages.length - 1) ? '100%' : '50%'
      const display = (this.pagenr === this.source.pages.length - 1) ? 'none' : 'inline-block'
      return ({ ...this.footerStyle, display, width })
    },
    footerStyleVerso () {
      const width = (this.pagenr === 0) ? '100%' : '50%'
      const display = (this.pagenr === 0) ? 'none' : 'inline-block'
      return ({ ...this.footerStyle, display, width })
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
    },
    /**
     * flip pages forward
     */
    prevPage () {
      if (this.hasPrev) {
        this.$store.commit(mutations.SET_PAGE, { id: this.sourceId, page: this.pagenr - 1 })
      }
    },
    /**
     * flip pages backward
     */
    nextPage () {
      if (this.hasNext) {
        this.$store.commit(mutations.SET_PAGE, { id: this.sourceId, page: this.pagenr + 1 })
      }
    },
    /**
     * select this source
     *
     * @param {Object} e - event object
     */
    selectSource (e) {
      if (e) {
        e.preventDefault()
      }
      this.$store.commit(mutations.ACTIVATE_SOURCE, this.sourceId)
    },
    /**
     * handle drag and drop
     *
     * @param {Object} e - drag event
     */
    dragHandler (e) {
      // console.log(e)
      var pos = new OpenSeadragon.Point(e.originalEvent.clientX, e.originalEvent.clientY)
      pos = this.viewer.viewport.windowToViewportCoordinates(pos)
      if (!this.dragDelta) {
        this.dragDelta = {
          x: pos.x - this.sourcePosition.x,
          y: pos.y - this.sourcePosition.y
        }
        // console.log(this.dragDelta)
        this.selectSource()
      }
      pos = new OpenSeadragon.Point(pos.x - this.dragDelta.x, pos.y - this.dragDelta.y)
      this.moveTo(pos.x, pos.y)
    },
    /**
     * handle drag drop
     *
     * @param {Object} e - drag event
     */
    dragEndHandler (e) {
      this.dragDelta = null
    },
    /**
     * move SourceComponent to new position
     *
     * @param {Number} x - horizontal coordinate (viewport)
     * @param {Number} y - vertical coordinate (viewport)
     */
    moveTo (x, y) {
      this.sourcePosition = { x: x, y: y }
      // console.log(this.sourcePosition)
      this.$store.commit(mutations.MOVE_SOURCE, { id: this.sourceId, ...this.sourcePosition })
      this.$emit('move-source', this.sourcePosition.x, this.sourcePosition.y)
    }
  }
}
</script>

<style lang="scss" scoped>
.document-footer {
  // outline: 1px solid red;
  padding: 0%;
  margin: 0%;

  &:hover {
    outline: 1px solid #0000ff22;
  }

  .top-left {
    position: absolute;
    left: 0;
    height: 100%;
    background: radial-gradient(ellipse 100% 100% at bottom right, #dddddd, #ffffff);
    // border-radius: 100% 0% 0% 0%;
  }
  .top-right {
    position: absolute;
    right: 0;
    height: 100%;
    background: radial-gradient(ellipse 100% 100% at bottom left, #dddddd, #ffffff);
    // border-radius: 0% 100% 0% 0%;
  }
  .btn {
    width: 100%;
    height: 100%;
    margin: 0%;
    padding: 0%;
  }
  #draghandle {
    cursor: pointer;
  }
  .bottom-title {
    position: absolute;
    height: 100%;
    text-align: center;
    white-space: nowrap;
    // TODO color consts in separate file
    background: linear-gradient(0deg, #dddddd, #ffffff);

    .pagenr {
      position: absolute;
      top: 0;
      width: 10%;
      height: 100%;
      // outline: 1px solid red;

      svg {
        // max-width: 100%;
        height: 100%;
      }
    }
    .recto {
      right: 0;
    }
    .verso {
      left: 0;
    }

    .title {
      position: absolute;
      left: 10%;
      width: 80%;
      overflow: hidden;
      svg {
        left: 0;
        // max-width: 100%;
        height: 100%;
        width: auto;
      }
    }
  }
}
.activeSource {
  outline: 2px solid #ff000033;
}

</style>
