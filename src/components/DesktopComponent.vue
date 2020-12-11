<template>
  <div :id="this.divid"></div>
</template>

<script>
import Vue from 'vue'
import OpenSeadragon from 'openseadragon'
import SourceComponentFactory from '@/components/SourceComponent'
import DesktopAccess from '@/mixins'
import osddef from '@/config/osd.default.js'
import { desktopTile } from '@/toolbox'

// create SourceComponent component-constructor
const SourceComponent = Vue.extend(SourceComponentFactory)

/**
 * OpenSeadragon component
 *
 * @module components.DesktopComponent
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
  mixins: [DesktopAccess],
  components: {},
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
    /**
     * init Desktop Viewer with properties,
     * add tiled background image and add selected sources.
     */
    init () {
      // console.log(this.viewerprops)
      const viewer = OpenSeadragon(this.viewerprops)
      // console.log(viewer)
      // console.log(viewer.fabricjsOverlay)
      // console.log(viewer.htmlOverlay)

      // load desktop background
      viewer.addTiledImage({
        tileSource: this.backsrc,
        x: 0,
        y: 0,
        width: this.width
      })

      // make OpenSeadragon Viewer and component avilable through the store
      this.$store.commit('SET_VIEWER', viewer)
      this.$store.commit('SET_DESKTOP', this)

      // for every node in the store create and init (empty mount) SourceComponent
      const sources = this.$store.getters.sources
      sources.forEach(source => {
        // console.log(source.id)
        const srcfacs = new SourceComponent({
          propsData: {
            sourceId: source.id,
            desktop: this
          }
        })
        srcfacs.$mount()
      })
      viewer.addHandler('resize', this.updateView)
      viewer.addHandler('zoom', this.updateView)
      viewer.addHandler('open', this.updateView)
    },
    updateView (e) {
      const sources = this.$store.getters.sources
      sources.forEach((source, i) => {
        if (source.component) {
          source.component.updateDashPos()
        }
      })
    }
  },
  mounted () {
    this.init()
  },
  computed: {
  }
}
</script>

<style scoped>
#osd-canvas {
  width: 100%;
  height: 800px;
}
</style>
