<template>
  <div :id="this.divid">
    <div v-if="viewer">
      <source-component
        v-for="source in sources"
        :key="source.id"
        :sourceId="source.id"
      />
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
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
 * @vue-prop {String} [divid='desktop-canvas'] - ID of container div
 * @vue-prop {Object} [osdinit={}] - configuration of OSD Viewer &ndash; overrides default config
 * @vue-prop {Number} [width=1600] - desktop width
 * @vue-prop {Number} [height=1000] - desktop height
 * @vue-prop {URL} [backsrc=data] - source of tiled background image (default is beige rectangle)
 * @vue-computed {Viewer} viewer - OpenSeaDragon Viewer object (placed in vuex store)
 * @vue-computed {Object[]} sources - source objects
 * @vue-computed {Number} scale - current viewer scale
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
    /**
     * adjust view for current scale
     */
    updateView (e) {
      if (e.zoom) {
        // console.log('zoom: ' + this.viewer.viewport.viewportToImageZoom(e.zoom))
      }
      this.$store.commit('UPDATE_SCALE')
    }
  },
  mounted () {
    // create OpenSeadragon viewer
    this.$store.dispatch('createOpenSeaDragon', {
      divid: this.divid,
      handler: {
        resize: this.updateView,
        zoom: this.updateView,
        open: this.updateView
      },
      config: this.viewerprops,
      TIback: {
        tileSource: this.backsrc,
        x: 0,
        y: 0,
        width: this.width
      }
    })
  },
  updated () {
    this.$store.commit('UPDATE_SCALE')
    if (this.scale !== this.scaleCache) {
      // console.log(this.scale)
      this.scaleCache = this.scale
    }
  },
  beforeDestroy () {
    // destroy OpenSeadragon viewer
    this.$store.dispatch('destroyOpenSeaDragon')
  },
  computed: {
    ...mapGetters(['sources', 'viewer', 'scale'])
  }
}
</script>

<style scoped>
#osd-canvas {
  width: 100%;
  height: 800px;
}
</style>
