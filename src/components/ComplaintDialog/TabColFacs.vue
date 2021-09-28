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
import config from '@/config'

/**
 * @module components/ComplaintDialog/TabColFacs
 * @vue-prop {String} label - label/title of image (facsimile)
 * @vue-prop {Object} [osdinit={}] - extra options for OpenSeadragon
 * @vue-prop {String} pageid - id of page object
 * @vue-prop {String} region - region of facsimile in iiif format (xywh=1,2,3,4)
 */
export default {
  name: 'ComplaintDialogTabColFacs',
  data () {
    return {
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
  /* TODO
   * - method initOSD() ?
   * - on pageID exchange tiled image
   * - on region change fitBounds
   */
  mounted () {
    const props = this.viewerConfig
    this.viewer = OpenSeadragon(props)
    this.viewer.addHandler('open', () => {
      this.viewer.viewport.fitBounds(this.fitBounds, true)
    })
    this.viewer.addHandler('zoom', this.rezoom())
    this.viewer.addHandler('pan', this.rezoom())
    this.viewer.addHandler('resize', this.rezoom(0))
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
      this.rezoom()
    }
  },
  computed: {
    ...mapGetters([
      getters.getPage,
      'complaintFacsimileAspect'
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
        ...config.osd,
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
      // console.log(fitBounds)
      return fitBounds
    },
    styles () {
      // console.log(this.$store.getters.complaintFacsimileHeight)
      return {
        // height: this.complaintFacsimileHeight
        'aspect-ratio': this.complaintFacsimileAspect
      }
    }
  },
  methods: {
    rezoom (timeout = 5000) {
      return () => {
        this.rezoomTime = Date.now()
        setTimeout(() => {
          if (Date.now() - this.rezoomTime >= timeout) {
            this.viewer.viewport.fitBounds(this.fitBounds, timeout === 0)
          }
        }, timeout)
      }
    },
    /**
     * open the corresponding page in the source on the desktop
     */
    openPage () {
      // console.log(this.page.pagenumber)
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

h2 {
    text-align: left;
    font-size: .9rem;
    font-weight: 400;
    margin: 0 0 .2rem;
    padding: 0;
}

.ComplaintDialogOSD {
  width: 100%;
}

.complaint-region {
  background-color: transparent;
  -webkit-box-shadow: 0 0 1vw rgba(0, 0, 0, .5);
  -moz-box-shadow:    0 0 1vw rgba(0, 0, 0, .5);
  box-shadow:         0 0 1vw rgba(0, 0, 0, .5);
  border-radius: 3px;
}
</style>
