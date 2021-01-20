<template>
  <div :id="this.divid">
    <source-component v-for="source in sources" :key="source.id" :sourceId="source.id" />
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
// import OpenSeadragon from 'openseadragon'
import SourceComponent from '@/components/SourceComponent'
import osddef from '@/config/osd.default.js'
import { desktopTile } from '@/toolbox'

// create SourceComponent component-constructor
// const SourceComponent = Vue.extend(SourceComponentFactory)

/**
 * OpenSeadragon component
 *
 * @module components/DesktopComponent
 * @vue-data {Object} viewerprops - configuration of OpenSeaDragon Viewer (<code>config/osd.default.js</code>)
 * @vue-prop {String} [divid='desktop-init'] - ID of container div
 * @vue-prop {Object} [osdinit={}] - configuration of OSD Viewer &ndash; overrides default config
 * @vue-prop {Number} [width=1600] - desktop width
 * @vue-prop {Number} [height=1000] - desktop height
 * @vue-prop {URL} [backsrc=data] - source of tiled background image (default is beige rectangle)
 * @vue-computed {Viewer} viewer - OpenSeaDragon Viewer object (placed in vuex store)
 */
export default {
  name: 'DesktopComponent',
  components: {
    SourceComponent
  },
  data: function () {
    return {
      viewerprops: { ...osddef, ...this.osdinit }
    }
  },
  props: {
    divid: {
      type: String,
      default: 'desktop-canvas'
    },
    osdinit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width: {
      type: Number,
      default: 1600
    },
    height: {
      type: Number,
      default: 1000
    },
    backsrc: {
      type: Object,
      default: function () {
        return {
          height: this.height,
          width: this.width,
          tileSize: 256,
          minLevel: 8,
          getTileUrl: function (level, x, y) {
            // console.log(desktopTile)
            return desktopTile
          }
        }
      }
    }
  },
  methods: {
    ...mapGetters([
      'viewer',
      'desktop'
    ]),
    /**
     * init Desktop Viewer with properties,
     * add tiled background image and add selected sources.
     */
    init () {
      this.viewer.addHandler('resize', this.updateView)
      this.viewer.addHandler('zoom', this.updateView)
      this.viewer.addHandler('open', this.updateView)
    },
    updateView (e) {
      const sources = this.$store.getters.sources
      sources.forEach((source, i) => {
        if (source.component) {
          const pageXr = source.component.getPageX({ place: 'recto' })
          const pageYr = source.component.getPageY({ place: 'recto' })
          const pageXv = source.component.getPageX({ place: 'verso' })
          const pageYv = source.component.getPageY({ place: 'verso' })
          const pagePr = { x: pageXr, y: pageYr }
          const pagePv = { x: pageXv, y: pageYv }

          source.component.updateDashPos()
          source.component.updateOverlays((ovl) => {
            return (ovl.page.place === 'verso') ? pagePv : pagePr
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters(['sources', 'viewer'])
  }
}
</script>

<style scoped>
#osd-canvas {
  width: 100%;
  height: 800px;
}
</style>
