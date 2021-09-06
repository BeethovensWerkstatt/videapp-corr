<template>
  <div>
    <h2>{{ label }}</h2>
    <!--
    <input type="range" min="25" max="150" class="slider" v-model="izoom" />
    <div class="facsView">
      <img :src="src" :style="{ width: izoom + '%' }" />
    </div>
    -->
    <div :id="divid" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import tb from '@/toolbox'
import { getters } from '@/store/names'
// get page by ID -> uri -> OSD()

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
    this.viewer = OpenSeadragon(this.viewerConfig)
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
    viewerConfig () {
      // console.log(this.pageId, tb.parsexywh(this.region))
      const page = this.getPage(this.pageId)
      // console.log(page)
      const tileSource = {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': this.pageId,
        profile: 'http://iiif.io/api/image/2/level2.json',
        protocol: 'http://iiif.io/api/image',
        width: page.pixels.width,
        height: page.pixels.height
      }
      const props = {
        id: this.divid,
        showNavigator: false,
        ...this.osdinit,
        tileSources: {
          x: 0,
          y: 0,
          width: page.dimensions.width,
          tileSource
        }
      }
      console.log(props)
      return props
    },
    bounds () {
      return new OpenSeadragon.Rect(...tb.parsexywh(this.region))
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
#divid {
  width: 100%;
  height: 400px;
}
</style>
