<template>
  <div
    class="sourceBack"
    :class="{ active: isActive }"
    :id="this.divid"
    :title="label"
  >
    <btn-group>
      <btn
        @click="prevPage"
        :disabled="!hasPrev">
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
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
// import PageComponent from '@/components/PageComponent.vue'

/**
 * @module components/SourceComponent
 */
export default {
  // components: { PageComponent },
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
      this.$el,
      new OpenSeadragon.Point(this.dashX, this.dashY),
      OpenSeadragon.TOP_CENTER)
  },
  updated () {
    console.log('dashX: ' + this.dashX)
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
    dragHandle () {
      return this.$el.querySelector('#draghandle')
    },
    dashX () {
      console.log(this.$el.clientWidth + ' * ' + this.scale)
      const ow = this.$el.clientWidth * this.scale
      return this.source.position.x - (ow / 2)
    },
    dashY () {
      return this.source.position.y + (this.source.maxDimensions.height / 2)
    },
    versoX () {
      return 0
    },
    versoY () {
      return 0
    },
    rectoX () {
      return 0
    },
    rectoY () {
      return 0
    }
  },
  methods: {
    checkPageNr (pnr) {
      return (pnr >= 0 && pnr < this.source.pages.length)
    },
    prevPage (e) {

    },
    nextPage (e) {

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
