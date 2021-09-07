<template>
  <div>
    <h2 @click="openPage">{{ label }}</h2>
    <div :id="divid" class="ComplaintDialogOSD" :style="styles">
      <div :id="ovlid" class="complaint-region" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import tb from '@/toolbox'
import { mutations, getters } from '@/store/names'

/**
 * @module components/ComplaintDialog/TabColFacs
 * @vue-data {Number} izoom - image zoom factor in percent of width (TODO get resolution and width of image)
 * @vue-prop {String} label - label/title of image (facsimile)
 * @vue-prop {Object} [osdinit={}] - extra options for OpenSeadragon
 * @vue-prop {String} pageid - id of page object
 * @vue-prop {String} region - region of facsimile in iiif format (xywh=1,2,3,4)
 */
export default {
  name: 'ComplaintDialogTabColFacs',
  data () {
    return {
      izoom: 100,
      viewer: undefined,
      rezoomTime: Date.now()
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
    this.viewer = OpenSeadragon(props)
    this.viewer.addHandler('open', () => {
      this.viewer.viewport.fitBounds(this.fitBounds, true)
    })
    const rezoom = () => {
      const timeout = 5000
      this.rezoomTime = Date.now()
      setTimeout(() => {
        if (Date.now() - this.rezoomTime >= timeout) {
          this.viewer.viewport.fitBounds(this.fitBounds, false)
        }
      }, timeout)
    }
    this.viewer.addHandler('zoom', rezoom)
    this.viewer.addHandler('pan', rezoom)
    this.viewer.addHandler('resize', rezoom)
  },
  beforeDestroy () {
    if (this.viewer) {
      this.viewer.destroy()
    }
  },
  watch: {
    pageId () {
      console.log('TODO reload tiled image')
    },
    region () {
      console.log('TODO reload tiled image')
    }
  },
  computed: {
    ...mapGetters([
      getters.getPage,
      'complaintFacsimileHeight'
    ]),
    divid () {
      return this.page.uuid + '_osd'
    },
    ovlid () {
      return this.page.uuid + '_ovl'
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
            height: this.page.pixels.height,
            success: (e) => {
              this.viewer.addOverlay(this.$el.querySelector('#' + this.ovlid), this.bounds)
            }
          },
          x: 0,
          y: 0,
          width: this.page.dimensions.width
        }
      }
      // console.log(props)
      return props
    },
    scaleFactor () {
      return parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
    },
    bounds () {
      const bounds = tb.parsexywh(this.region)
      // console.log(this.scaleFactor)
      const osbounds = new OpenSeadragon.Rect(
        bounds.x * this.scaleFactor,
        bounds.y * this.scaleFactor,
        bounds.width * this.scaleFactor,
        bounds.height * this.scaleFactor
      )
      // console.log(osbounds)
      return osbounds
    },
    fitBounds () {
      const fitBounds = this.bounds
      fitBounds.x -= 2
      fitBounds.y -= 2
      fitBounds.width += 4
      fitBounds.height += 4
      console.log(fitBounds)
      return fitBounds
    },
    styles () {
      // console.log(this.$store.getters.complaintFacsimileHeight)
      return {
        height: this.complaintFacsimileHeight
      }
    }
  },
  methods: {
    openPage () {
      console.log(this.page.pagenumber)
      this.$store.commit(
        mutations.SET_PAGE,
        {
          id: this.page.source,
          page: this.page.pagenumber
        }
      )
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
.ComplaintDialogOSD {
  width: 100%;
}

.complaint-region {
  background-color: transparent;
  -webkit-box-shadow: 0px 0px 16px 18px rgba(50, 50, 50, 0.75);
  -moz-box-shadow:    0px 0px 16px 18px rgba(50, 50, 50, 0.75);
  box-shadow:         0px 0px 16px 18px rgba(50, 50, 50, 0.75);
}
</style>
