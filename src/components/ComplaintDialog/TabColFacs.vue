<template>
  <div>
    <h2 @click="openPage">
      {{ $t("terms.complaint.state." + state + "Doc") }}: <span class="sourceSiglum">{{ label }}</span>
      <!-- <div
        class="zoomLocker"
        @click="rezoom(500, true)"
        v-html="pinned ? '&#x1F512;' : '&#x1F513;'"
        :title="$t('messages.comparative-view.' + (pinned ? 'zoom-lock' : 'zoom-unlock'))"
      /> -->
    </h2>
    <div :id="divid" class="ComplaintDialogOSD" :class="{ ['facs-' + state]: true, facs: true, [state]: true }" :style="styles">
      <div :id="ovlid" class="complaint-region" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import tb from '@/toolbox'
import n from '@/store/names'
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
      rezoomTime: Date.now(),
      pinned: false,
      tidata: undefined
    }
  },
  props: {
    idx: {
      type: Number,
      default: 0 // TODO: TabCol.vue with counter
    },
    label: {
      type: String,
      required: true
    },
    osdinit: {
      type: Object,
      default: () => ({})
    },
    pageId: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    state: {
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
      this.viewer.viewport.fitBounds(this.fitBounds, false)
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
      console.log('reload tiled image')
      const tisrc = {
        tileSource: this.tileSource,
        success: (e) => {
          if (this.tidata) {
            this.viewer.world.setItemIndex(this.tidata, 0)
            this.tidata.setOpacity(0)
            this.tidata.destroy()
          }
          this.tidata = e.item
        },
        x: 0,
        y: 0,
        width: this.page.dimensions.width
      }
      this.viewer.addTiledImage(tisrc)
    },
    region () {
      console.log('change region')
      const overlay = this.viewer.getOverlayById(this.ovlid)
      overlay.update(this.bounds)
      this.viewer.viewport.fitBounds(this.fitBounds, false)
      this.rezoom()
    },
    pinned () {
      if (!this.pinned) {
        this.rezoom()
      }
    }
  },
  computed: {
    ...mapGetters([
      n.getters.getPage,
      n.getters.complaintFacsimileAspect,
      n.getters.version,
      n.getters.mainbranch
    ]),
    mainbranch: () => this[n.getters.mainbranch],
    divid () {
      return 'q' + this.idx + '_' + this.state + '_osd'
    },
    ovlid () {
      return 'q' + this.idx + '_' + this.state + '_ovl'
    },
    page () {
      return this[n.getters.getPage](this.pageId)
    },
    tileSource () {
      return {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': this.page.uri,
        profile: 'http://iiif.io/api/image/2/level2.json',
        protocol: 'http://iiif.io/api/image',
        width: this.page.pixels.width,
        height: this.page.pixels.height
      }
    },
    viewerConfig () {
      // console.log(this.pageId, tb.parsexywh(this.region))
      // console.log(this.page.uri)
      const tileSource = {
        ...this.tileSource,
        success: (e) => {
          this.tidata = e.item
          this.viewer.addOverlay(this.$el.querySelector('#' + this.ovlid), this.bounds)
        }
      }
      const props = {
        ...config.osd,
        ...this.osdinit,
        id: this.divid,
        showNavigator: false,
        tileSources: {
          tileSource: tileSource,
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
    rezoom (timeout = 5000, toggle) {
      if (toggle) {
        this.pinned = !this.pinned
      }
      return () => {
        this.rezoomTime = Date.now()
        setTimeout(() => {
          if (Date.now() - this.rezoomTime >= timeout && !this.pinned) {
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
        n.mutations.SET_PAGE,
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
  font-size: .8rem;
  font-weight: 500;
  margin: 0.5rem 0rem .2rem;
  padding: .3rem;
  background-color: #6CA5B4;
  border: 1px solid #333333;
  cursor: default;

  .sourceSiglum {
    font-weight: 700;
  }

  .zoomLocker {
    float: right;
  }
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
