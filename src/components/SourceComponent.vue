<template>
  <div>
    <page-component
      :divid="divid + '_recto'"
      :page="source.pages[pagenr].r"
      :pos="rectoPos"
      :active="isActive"
    />
    <page-component
      :divid="divid + '_verso'"
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
      tracker: null
    }
  },
  mounted () {
    this.tracker = new OpenSeadragon.MouseTracker({
      element: this.dragHandle,
      clickHandler: () => { this.selectSource() },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler,
      releaseHandler: this.dragEndHandler
    })
    this.viewer.addOverlay(
      this.dashboard,
      new OpenSeadragon.Point(this.dashX, this.dashY),
      OpenSeadragon.TOP_CENTER)
  },
  updated () {
    // console.log('dashX: ' + this.dashX)
    if (this.overlay) {
      this.overlay.update(new OpenSeadragon.Point(this.dashX, this.dashY), OpenSeadragon.TOP_CENTER)
    }
  },
  computed: {
    ...mapGetters(['viewer']),
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
      return this.viewer.getOverlayById(this.divid)
    },
    dashboard () {
      return this.$el.querySelector('#' + this.divid)
    },
    dragHandle () {
      return this.$el.querySelector('#draghandle')
    },
    dashX () {
      // const dim = new OpenSeadragon.Point(this.$el.clientWidth, this.$el.clientHeight)
      // const ow = this.viewer.viewport.viewerElementToViewportCoordinates(dim).x
      return this.position.x // - (ow / 2)
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
        return new OpenSeadragon.Point(x, y)
      }
      return new OpenSeadragon.Point(0, 0)
    },
    versoPos () {
      const pp = this.source.pages[this.pagenr]
      if (pp.v) {
        // center page, if no recto page
        const x = this.position.x - (pp.r ? 0 : (pp.v.dimensions.width / 2))
        const y = this.position.y - (pp.v.dimensions.height / 2)
        return new OpenSeadragon.Point(x, y)
      }
      return new OpenSeadragon.Point(0, 0)
    }
  },
  methods: {
    checkPageNr (pnr) {
      return (pnr >= 0 && pnr < this.source.pages.length)
    },
    prevPage (e) {
      if (this.hasPrev) {
        this.$store.commit('SET_PAGE', { id: this.sourceId, page: this.pagenr - 1 })
      }
    },
    nextPage (e) {
      if (this.hasNext) {
        this.$store.commit('SET_PAGE', { id: this.sourceId, page: this.pagenr + 1 })
      }
    },
    /**
     * place source on top of the stack
     */
    placeOnTop () {
      const ci = this.viewer.world.getItemCount()
      console.log('TODO place on top: ' + ci)
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
      // this.placeOnTop()
    },
    dragHandler (e) {
      const delta = this.viewer.viewport.deltaPointsFromPixels(e.delta)
      this.moveTo(this.position.x + delta.x, this.position.y + delta.y)
    },
    dragEndHandler (e) {
    },
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
