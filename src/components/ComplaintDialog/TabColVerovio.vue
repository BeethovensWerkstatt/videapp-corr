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
      <div :id="vid" v-html="svg" />
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters } from 'vuex'
// import VerovioComponent from '@/components/VerovioComponent.vue'
import OpenSeadragon from 'openseadragon'
import axios from 'axios'
import config from '@/config'
import { desktopTile } from '@/toolbox'
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
      svg: undefined
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
    this.viewer.addOverlay({
      element: this.$el.querySelector('#' + this.vid),
      location: OpenSeadragon.Point(0, 0)
    },
    OpenSeadragon.Point(0, 0))
    this.loadMEI()
  },
  beforeDestroy () {
    if (this.viewer) {
      this.viewer.destroy()
    }
  },
  computed: {
    ...mapGetters(['vrvToolkit']),
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
    }
  },
  methods: {
    loadMEI () {
      // console.log(this.options)
      if (this.options?.url) {
        startProc()
        console.log('load', this.options.url)
        this.mei = undefined
        this.svg = undefined
        axios.get(this.options.url).then(({ data }) => {
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
            console.log(viewBox, viewBox.height / viewBox.width)
          }
        }).catch(error => {
          console.error(error)
        }).finally(() => {
          finishProc()
        })
      }
    },
    /**
     * taken from module 1 VideApp
     */
    _getVerovioDimensions (renderedSvg) {
      try {
        const viewBoxHeight = parseInt(renderedSvg.querySelector('svg.definition-scale').getAttribute('viewBox').split(' ')[3], 10)
        const firstStaffLineYPos = parseInt(renderedSvg.querySelector('g.measure g.staff path:first-of-type').getAttribute('d').split(' ')[1], 10)
        const lastStaffLineYPos = parseInt(renderedSvg.querySelector('g.measure g.staff path:last-of-type').getAttribute('d').split(' ')[1], 10)

        const staffHeight = lastStaffLineYPos - firstStaffLineYPos
        const staffHeightRelation = staffHeight / viewBoxHeight

        const widthAttr = renderedSvg.childNodes[0].getAttribute('width')
        const width = parseInt(widthAttr, 10)

        const heightAttr = renderedSvg.childNodes[0].getAttribute('height')
        const height = parseInt(heightAttr, 10)

        return {
          relation: staffHeightRelation,
          staffHeight: staffHeight,
          viewBoxHeight: viewBoxHeight,
          width: width,
          height: height
        }
      } catch (err) {
        console.log('')
        console.log('[ERROR] Unable to determine dimensions of rendered SVG: ' + err)
        console.log(renderedSvg)
        return {
          relation: -1
        }
      }
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
