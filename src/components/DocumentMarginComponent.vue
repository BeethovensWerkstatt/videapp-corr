<template>
  <div
    class="document-margin"
    :id="divid"
  >
    <div class="left-margin" :style="style">
      <div
        v-for="(m, i) in leftMarkers"
        :key="i"
        class="marker markerLeft"
        :class="{ curmarkerL: source.pagenr == m.page }"
        :style="{ height: (markerPerc * .9) + '%', top: (i * markerPerc) + '%' }"
        @click="flipPage(m)"
        :title="m.name.verso"
      >
        <div>{{ m.name.verso }}</div>
      </div>
    </div>
    <div class="right-margin" :style="style">
      <div
        v-for="(m, i) in rightMarkers"
        :key="i"
        class="marker markerRight"
        :class="{ curmarkerR: source.pagenr == m.page }"
        :style="{ height: (markerPerc * .9) + '%', top: ((i + leftMarkers.length) * markerPerc) + '%' }"
        @click="flipPage(m)"
        :title="m.name.recto"
      >
        <div>{{ m.name.recto }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
// import tb from '@/toolbox'

export default {
  name: 'DocumentMarginComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    position: {
      type: Object,
      required: true
    }
  },
  mounted () {
    // create overlay for margin bars
    if (this.viewer) {
      this.viewer.addOverlay({
        element: this.$el,
        location: this.position
      }, this.position, OpenSeadragon.TOP_CENTER)
    }
  },
  watch: {
    position () {
      // console.log(this.position)
      this.updatePosition()
    }
  },
  computed: {
    ...mapGetters([
      'viewer',
      'sourceHeaderHeight',
      'sourceMarginWidth',
      'sourceMarkerHeight',
      'getSourceById',
      'getPageMarkers'
    ]),
    divid () {
      return this.sourceId + '_margin'
    },
    source () {
      return this.getSourceById(this.sourceId)
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
    marginPerc () {
      return (100 * this.sourceMarginWidth / this.position.width)
    },
    markerPerc () {
      // console.log('marcerPerc')
      return (100 * this.sourceMarkerHeight / this.position.height)
    },
    style () {
      const zoom = this.viewer.viewport.getZoom(true)
      const scale = this.viewer.viewport._containerInnerSize.x * zoom
      // console.log('marker scale', scale)
      return {
        width: this.marginPerc + '%',
        'font-size': scale * 2 + 'mm'
      }
    },
    leftMarkers () {
      // console.log('leftMarkers')
      const markers = this.getPageMarkers(this.sourceId)
      const pn = this.source.pagenr ? this.source.pagenr : 0
      return markers.filter(m => (m.page < pn || (m.page === pn && m.place === 'verso')))
    },
    rightMarkers () {
      // console.log('rightMarkers')
      const markers = this.getPageMarkers(this.sourceId)
      const pn = this.source.pagenr ? this.source.pagenr : 0
      return markers.filter(m => {
        // if (m.page === pn) console.log(m.page, m.place)
        return (m.page > pn || (m.page === pn && m.place === 'recto'))
      })
    }
  },
  methods: {
    // createImageFromText: tb.createImageFromText,
    updatePosition () {
      if (this.overlay) {
        this.overlay.update(this.position)
      }
    },
    flipPage (marker) {
      // console.log('go to page ' + marker.page)
      this.$store.commit('SET_PAGE', { id: this.sourceId, page: marker.page })
      // console.log('gone to page ' + marker.page)
    }
  }
}
</script>

<style lang="scss" scoped>
.document-margin {
  position: relative;

  .left-margin {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    // TODO color consts in separate file
    // background: linear-gradient(270deg, #dddddd, #ffffff);
  }
  .right-margin {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    // TODO color consts in separate file
    // background: linear-gradient(90deg, #dddddd, #ffffff);
  }

  .marker {
    position: absolute;
    width: 90%;
    overflow: hidden;
    background: rgb(250,226,50);
    background: linear-gradient(0deg, rgba(250,226,50,1) 0%, rgba(255,252,102,1) 100%);
    cursor: pointer;
    font-size: 60%;
    // outline: 1px solid rgba(255, 166, 0, 0.349);

    &.markerLeft {
      right: 0;
      border-radius: 5px 0 0 5px;
    }

    &.markerRight {
      left: 0;
      border-radius: 0 5px 5px 0;
    }

    &:hover {
      // outline: 1px solid orange;
      // background-color: rgba(255, 255, 181, 0.685);
    }
    div {
      width: 500px;
    }
  }
  .curmarkerL {
    font-weight: bold;
    width: 110% !important;
    right: -20%;
    background-color: rgba(255, 255, 181, 0.8);
  }
  .curmarkerR {
    font-weight: bold;
    width: 110% !important;
    left: -20% !important;
    padding-left: 20%;
    background-color: rgba(255, 255, 181, 0.8);
  }
}
</style>
