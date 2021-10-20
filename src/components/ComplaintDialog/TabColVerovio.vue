<template>
  <div class="ComplaintDialogVOSDouter">
    <h2>{{ label }}</h2>
    <div :id="divid" class="ComplaintDialogVOSD">
      <div :id="verovioSvgContainerId" v-html="svg" />
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
// import VerovioComponent from '@/components/VerovioComponent.vue'
import OpenSeadragon from 'openseadragon'
// import axios from 'axios'
import config from '@/config'
import { transpTile } from '@/toolbox'
import { startProc, finishProc } from '@/store'

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
      viewerprops: { ...config.osd, ...this.osdinit },
      toolkit: undefined,
      mei: undefined,
      svg: undefined,
      width: 1,
      height: 1
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
    divid: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  /* TODO
   * - created
   * 1. load MEI
   * 2. create and measure SVG
   * - mounted
   * 3. create OSD viewer
   * 4. add tiled image (transparent)
   * 5. add overlay
   */
  created () {
    this.loadMEI()
  },
  mounted () {
    // this.createViewer()
    // console.log(this.viewer)
  },
  beforeDestroy () {
    if (this.viewer) {
      this.viewer.destroy()
    }
    // TODO toolkit destroy??
  },
  watch: {
    osdinit () {
      // this.createViewer()
    },
    vid () {
      // this.loadMEI()
      // this.createViewer()
    }
  },
  computed: {
    ...mapGetters(['vrvToolkit']),
    verovioSvgContainerId () {
      return this.divid + '_ovl'
    },
    viewerConfig () {
      // console.log(this.pageId, tb.parsexywh(this.region))
      // console.log(this.page.uri)
      const props = {
        ...config.osd,
        ...this.osdinit,
        id: this.divid,
        showNavigator: false,
        maxZoomLevel: 4
      }
      // console.log(props)
      return props
    },
    meiUrl () {
      return this.options?.url
    },
    vrvOptions () {
      const opts = {}
      // TODO config?
      opts.scale = 30
      opts.pageWidth = 10000
      opts.outputIndent = 1
      opts.adjustPageWidth = true
      opts.adjustPageHeight = true
      opts.svgBoundingBoxes = true
      opts.svgViewBox = true
      return opts
    },
    position () {
      // const scaleFactor = 1 / this.width
      // return new OpenSeadragon.Rect(0, 0, this.width * scaleFactor, this.height * scaleFactor)
      return new OpenSeadragon.Rect(0, 0, 1, this.height / this.width)
    },
    clipping () {
      // TODO useDisplayOptions for aspect-ratio of canvas and default clip
      const relwidth = 16 * this.position.height / 9
      const width = Math.min(this.position.width, relwidth)
      return new OpenSeadragon.Rect(0, 0, width, this.position.height)
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.verovioSvgContainer) : undefined
    }
  },
  methods: {
    /**
     * load MEI for transcription, render to SVG and add to overlay
     */
    loadMEI () {
      // console.log(this.options)
      if (this.options?.url) {
        startProc()
        console.log('load', this.options.url)
        this.mei = undefined
        this.svg = undefined
        this.width = 1
        this.height = 1
        // TODO store in pouchdb or localStorage?
        const callback = ({ data }) => {
          this.mei = data
          if (this.mei) {
            // console.log(this.mei)
            if (!this.toolkit) {
              this.toolkit = this.vrvToolkit()
            }
            this.toolkit.setOptions(this.vrvOptions)
            this.toolkit.loadData(this.mei)
            this.svg = this.toolkit.renderToSVG(1)
            const parser = new DOMParser()
            const renderedSVG = parser.parseFromString(this.svg, 'image/svg+xml')
            const viewBox = renderedSVG.activeElement.viewBox.baseVal
            this.width = viewBox.width
            this.height = viewBox.height
            this.createViewer()
          }
        }
        try {
          const url = this.options.url
          this.$store.dispatch('getData', { url, callback })
        } finally {
          finishProc()
        }
        // get from pouchdb - on fail fetch with axios
        /*
        axios.get(this.options.url).then(callback).catch(error => {
          console.error(error)
          if (this.viewer) {
            this.viewer.destroy()
          }
        }).finally(() => {
          finishProc()
        })
        */
      }
    },
    /* TODO refactor methods:
     * 1. load from PouchDB *or* from URL (axios)
     * 2. prepare OSD viewer
     */
    createViewer () {
      if (this.viewer) {
        this.viewer.destroy()
      }
      const props = this.viewerConfig
      // console.log(props)
      this.viewer = OpenSeadragon(props)
      // this.viewer.addHandler('zoom', () => console.log(this.viewer.viewport.getZoom(true)))
      // console.log(desktopTile)
      const TIback1 = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        tileSize: 256,
        minLevel: 8,
        getTileUrl: function (level, x, y) {
          // console.log(desktopTile)
          return transpTile
        }
      }
      // console.log(TIback1)
      this.viewer.addTiledImage({ tileSource: TIback1 })
      /*
      const TIback2 = {
        x: this.width,
        y: this.height,
        height: 1,
        width: 1,
        tileSize: 256,
        minLevel: 8,
        getTileUrl: function (level, x, y) {
          // console.log(desktopTile)
          return desktopTile
        }
      }
      this.viewer.addTiledImage({ tileSource: TIback2 })
      */

      // const svgcontainer = document.createElement('div')
      // svgcontainer.setAttribute('id', this.verovioSvgContainer)
      // svgcontainer.innerHTML = this.svg
      const svgcontainer = this.$el.querySelector('#' + this.verovioSvgContainerId)
      if (!svgcontainer.classList.contains('VSVGContainer')) {
        svgcontainer.classList.add('VSVGContainer')
      }

      console.log(this.position, this.clipping)
      this.viewer.addOverlay({
        element: svgcontainer,
        location: this.position
      }, new OpenSeadragon.Point(0, 0))
      this.viewer.viewport.fitBounds(this.clipping)
      // this.viewer.viewport.fitVertically()
    }
  }
}
</script>

<style lang="scss">

.ComplaintDialogVOSDouter {
  h2 {
      text-align: left;
      font-size: .8rem;
      font-weight: 100;
      margin: 0 0 .2rem;
      padding: 0;
      background-color: #f5f5f5;
  }

  .ComplaintDialogVOSD {
    width: 100%;
    aspect-ratio: 16/9;

    .VSVGContainer {
      // outline: 1px solid green;
      svg {
        width: 100%;

        .supplied * {
          fill: #999;
          stroke: #999;
        }

        .supplied .bounding-box * {
          fill: transparent;
        }

      }
    }
  }
}

</style>
