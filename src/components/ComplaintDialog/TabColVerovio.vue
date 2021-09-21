<template>
  <div>
    <h2>{{ label }}</h2>
    <!--
    <input :id="vid+'-zoom'" type="range" min="5" max="100" class="slider" v-model="vzoom" />
    <div class="vrvContainer">
      <verovio-component
        :id="vid"
        :options="voptions"
      />
    </div>
    -->
    <div :id="divid" class="ComplaintDialodVOSD">
      <div :id="vid" />
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import { mapGetters } from 'vuex'
// import VerovioComponent from '@/components/VerovioComponent.vue'
import OpenSeadragon from 'openseadragon'
import config from '@/config'
import { desktopTile } from '@/toolbox'

/**
 * @module components/ComplaintDialog/TabColVerovio
 * @vue-prop {String} vid - id for verovio element
 * @vue-prop {Options} options - verovio options
 * @vue-prop {String} label - label/title for this element
 */
export default {
  // components: { VerovioComponent },
  name: 'ComplaintDialogTabColVerovio',
  data () {
    return {
      viewer: undefined,
      viewerprops: { ...config.osd, ...this.osdinit }
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    osdinit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    vid: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  mounted () {
    const props = this.viewerConfig
    this.viewer = OpenSeadragon(props)
    const TIback = {
      height: 1,
      width: 1,
      tileSize: 256,
      minLevel: 8,
      getTileUrl: function (level, x, y) {
        // console.log(desktopTile)
        return desktopTile
      }
    }
    this.viewer.addTiledImage({
      tileSource: TIback
    })
  },
  beforeDestroy () {
    if (this.viewer) {
      this.viewer.destroy()
    }
  },
  computed: {
    divid () {
      return this.vid + '_ovl'
    },
    vzoom: {
      get () {
        return parseInt(this.zoom)
      },
      set (zoom) {
        this.zoom = parseInt(zoom)
      }
    },
    voptions () {
      return { ...this.options, scale: this.vzoom }
    },
    viewerConfig () {
      // console.log(this.pageId, tb.parsexywh(this.region))
      // console.log(this.page.uri)
      const props = {
        ...this.osdinit,
        id: this.divid,
        showNavigator: false
      }
      // console.log(props)
      return props
    }
  }
}
</script>

<style lang="scss" scoped>
.ComplaintDialodVOSD {
  width: 100%;
  aspect-ratio: 16/9;
  outline: 1px solid green;
}

.vrvContainer {
  width: 100%;
  overflow: auto;
  resize: vertical;
}
</style>
