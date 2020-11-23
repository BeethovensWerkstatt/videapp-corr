<template>
  <div id="osd-canvas"></div>
</template>

<script>
import OpenSeadragon from 'openseadragon'
import osddef from '@/config/osd.default.js'

export default {
  name: 'OpenSeadragon',
  data: function () {
    return {
      viewerprops: { ...osddef, ...this.osdinit }
    }
  },
  props: {
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
            return 'data:image/png;base64,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'
          }
        }
      }
    }
  },
  methods: {
    init () {
      const viewer = OpenSeadragon(this.viewerprops)

      console.log(this.viewerprops)

      this.$store.commit('SET_VIEWER', viewer)
      this.$store.commit('SET_OSD', this)
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    viewer () {
      return this.$store.getters.viewer
    }
  }
}
</script>

<style scoped>
#osd-canvas {
  width: 100%;
  height: 800px;
}
</style>
