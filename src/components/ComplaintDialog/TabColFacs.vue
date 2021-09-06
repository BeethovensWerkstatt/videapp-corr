<template>
  <div>
    <h2>{{ label }}</h2>
    <!--
    <input type="range" min="25" max="150" class="slider" v-model="izoom" />
    <div class="facsView">
      <img :src="src" :style="{ width: izoom + '%' }" />
    </div>
    -->
    <div :id="divid" class="ComplaintDialogOSD" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import tb from '@/toolbox'
import { getters } from '@/store/names'

/**
 * @module components/ComplaintDialog/TabColFacs
 * @vue-data {Number} izoom - image zoom factor in percent of width (TODO get resolution and width of image)
 * @vue-prop {String} src - image url
 * @vue-prop {String} label - label/title of image (facsimile)
 */
export default {
  name: 'ComplaintDialogTabColFacs',
  data () {
    return {
      izoom: 100,
      viewer: undefined
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
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
    pageId: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    }
  },
  mounted () {
    const props = this.viewerConfig
    props.tileSources.success = (e) => {
      this.viewer.viewport.fitBounds(this.bounds, false)
    }
    this.viewer = OpenSeadragon(props)
  },
  beforeDestroy () {
    if (this.viewer) {
      this.viewer.destroy()
    }
  },
  computed: {
    ...mapGetters([getters.getPage]),
    divid () {
      return this.pageId + '_osd'
    },
    page () {
      return this.getPage(this.pageId)
    },
    viewerConfig () {
      // console.log(this.pageId, tb.parsexywh(this.region))
      // console.log(this.page.uri)
      const props = {
        ...this.osdinit,
        id: this.divid,
        showNavigator: false,
        tileSources: {
          tileSource: {
            '@context': 'http://iiif.io/api/image/2/context.json',
            '@id': this.page.uri,
            profile: 'http://iiif.io/api/image/2/level2.json',
            protocol: 'http://iiif.io/api/image',
            width: this.page.pixels.width,
            height: this.page.pixels.height
          },
          x: 0,
          y: 0,
          width: this.page.dimensions.width
        }
      }
      // console.log(props)
      return props
    },
    bounds () {
      const bounds = tb.parsexywh(this.region)
      return new OpenSeadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height)
    }
  }
}
</script>

<style lang="scss" scoped>
.facsView {
  width: 100%;
  overflow: auto;
  resize: vertical;
}
.slider {
  width: 90%;
}
.ComplaintDialogOSD {
  width: 100%;
  height: 400px;
}
</style>
