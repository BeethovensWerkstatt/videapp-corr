<template>
  <div>
    <page-component
      :divid="divid + '_recto'"
      :sourceId="sourceId"
      :page="source.pages[pagenr].r"
      :pos="rectoPos"
      :active="isActive"
    />
    <page-component
      :divid="divid + '_verso'"
      :sourceId="sourceId"
      :page="source.pages[pagenr].v"
      :pos="versoPos"
      :active="isActive"
    />
    <div
      class="sourceBack"
      :class="{ active: isActive }"
      :id="this.divid"
      :title="label"
    >
      <btn-group>
        <btn
          @click="prevPage"
          :disabled="!hasPrev"
        >
        ◄
        </btn>
        <btn id="draghandle">
          ❂
        </btn>
        <btn
          @click="nextPage"
          :disabled="!hasNext"
        >
        ►
        </btn>
      </btn-group>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import PageComponent from '@/components/PageComponent.vue'

/**
 * @module components/SourceComponent
 * @vue-prop {String} sourceId - id of source object
 * @vue-prop {Number} [defaultPage=0] - first opend page on load
 * @vue-data {String} [divid=sourceId + '_dash'] - HTML id for dashboard overlay element
 * @vue-data {Object} position_ - private position variable (x, y)
 * @vue-data {Object} tracker - OpenSeadragon.MouseTracker object
 * @vue-computed {OpenSeadragon.Viewer} viewer - Viewer object
 * @vue-computed {Number} scale - current scale of viewer
 * @vue-computed {Object} source - source object retrieved by sourceId
 * @vue-computed {String} label - label/title of source
 * @vue-computed {Number} pagenr - index of page pair (recto/verso)
 * @vue-computed {Object} position - position (x,y) of component (viewport coordinate), move page components and overlay on change
 * @vue-computed {Boolean} hasPrev - previous page available
 * @vue-computed {Boolean} hasNext - next page available
 * @vue-computed {Boolean} isActive - sourceId === $store.activeSourceId
 * @vue-computed {OpenSeadragon.Overlay} overlay - overlay of control elements
 * @vue-computed {Object} dashboard - DOM control elements
 * @vue-computed {Object} dashHandle - DOM drag element
 * @vue-computed {Number} dashX - horizontal position of overlay
 * @vue-computed {Number} dashY - vertical position of overlay
 * @vue-computed {OpenSeadragon.Rect} rectoPos - position of recto page
 * @vue-computed {OpenSeadragon.Rect} versoPos - position of verso page
 */
export default {
  components: { PageComponent },
  name: 'SourceComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    defaultPage: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      divid: this.sourceId + '_dash',
      position_: { ...this.$store.getters.getSourceById(this.sourceId).position },
      tracker: null,
      dragDelta: null
    }
  },
  mounted () {
    // create MouseTracker for moving component via drag and drop
    this.tracker = new OpenSeadragon.MouseTracker({
      element: this.dragHandle,
      clickHandler: () => { this.selectSource() },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler,
      releaseHandler: this.dragEndHandler // do we need this?
    })
    // create overlay for control buttons
    this.viewer.addOverlay(
      this.dashboard,
      new OpenSeadragon.Point(this.dashX, this.dashY),
      OpenSeadragon.TOP_CENTER)
  },
  updated () {
    // update position of overlay on update of component
    // console.log('dashX: ' + this.dashX)
    if (this.overlay) {
      this.overlay.update(new OpenSeadragon.Point(this.dashX, this.dashY), OpenSeadragon.TOP_CENTER)
    }
  },
  watch: {
    // adjust position of overlay on change of scale
    scale () {
      if (this.overlay) {
        this.overlay.update(new OpenSeadragon.Point(this.dashX, this.dashY), OpenSeadragon.TOP_CENTER)
      }
    }
  },
  beforeDestroy () {
    // console.log('bye bye Source')
    if (this.overlay) {
      this.overlay.destroy()
    }
  },
  computed: {
    ...mapGetters(['viewer', 'scale']),
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
    label () {
      return this.source.label
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
    position: {
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
    hasPrev () {
      return this.checkPageNr(this.pagenr - 1)
    },
    hasNext () {
      return this.checkPageNr(this.pagenr + 1)
    },
    isActive () {
      return this.sourceId === this.$store.getters.activeSourceId
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
    dashboard () {
      return this.$el.querySelector('#' + this.divid)
    },
    dragHandle () {
      return this.$el.querySelector('#draghandle')
    },
    dashX () {
      const ow = (this.dashboard.clientWidth / this.scale)
      // console.log('dashX ' + ow)
      // TODO isSingle
      return this.position.x - (ow / 2)
    },
    dashY () {
      return this.position.y + (this.source.maxDimensions.height / 2)
    },
    rectoPos () {
      const pp = this.source.pages[this.pagenr]
      if (pp.r) {
        // center page, if no recto page
        const x = this.position.x - (pp.v ? pp.v.dimensions.width : (pp.r.dimensions.width / 2))
        const y = this.position.y - (pp.r.dimensions.height / 2)
        const width = pp.r.dimensions.width
        const height = pp.r.dimensions.height
        return new OpenSeadragon.Rect(x, y, width, height)
      }
      return new OpenSeadragon.Rect(0, 0, 0, 0)
    },
    versoPos () {
      const pp = this.source.pages[this.pagenr]
      if (pp.v) {
        // center page, if no recto page
        const x = this.position.x - (pp.r ? 0 : (pp.v.dimensions.width / 2))
        const y = this.position.y - (pp.v.dimensions.height / 2)
        const width = pp.v.dimensions.width
        const height = pp.v.dimensions.height
        return new OpenSeadragon.Rect(x, y, width, height)
      }
      return new OpenSeadragon.Rect(0, 0, 0, 0)
    }
  },
  methods: {
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
        this.$store.commit('SET_PAGE', { id: this.sourceId, page: this.pagenr - 1 })
      }
    },
    /**
     * flip pages backward
     */
    nextPage () {
      if (this.hasNext) {
        this.$store.commit('SET_PAGE', { id: this.sourceId, page: this.pagenr + 1 })
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
      this.$store.commit('ACTIVATE_SOURCE', this.sourceId)
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
          x: pos.x - this.position.x,
          y: pos.y - this.position.y
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
      this.position = { x: x, y: y }
      this.$store.commit('MOVE_SOURCE', { id: this.sourceId, ...this.position })
    }
  }
}
</script>

<style scoped lang="scss">
.sourceBack {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  width: 110px;
  text-align: center;
}

.btn {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: 5px;
  margin: 5pt;
  padding: 3pt;
}

.btn:hover {
  outline: 1px solid blue;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
.active {
  outline: 1px solid green;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
.hilite {
  outline: 1px solid green;
}
</style>
