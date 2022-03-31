<template>
  <div
    class="page-component"
    :id="divid"
    :class="{ hideovl: !tiledimage }"
  >
    <div v-if="showDetail" :style="style">
      <zone-component
        v-for="zone in zones"
        :key="zone.zone"
        :sourceId="sourceId"
        :zoneId="zone.zone"
        :x="(width > 0) ? (zone.x * scaleFactor / width) : 0"
        :y="(height > 0) ? (zone.y * scaleFactor / height) : 0"
        :width="(width > 0) ? (zone.width * scaleFactor / width) : 0"
        :height="(height > 0) ? (zone.height * scaleFactor / height) : 0"
      />
    </div>
    <div v-else :style="completeStyle">
      <div class="range-container">
        <div class="range-info">{{ measureRange }}</div>
      </div>
    </div>
    <div :class="activeComplaintId" class="svg-shapes" v-if="svgShapeUrl">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import ZoneComponent from '@/components/ZoneComponent.vue'
import { getters, actions } from '@/store/names'
import axios from 'axios'
import tb from '@/toolbox'

/**
 * Component for one page (recto or verso). Collect all measure-zones
 *
 * @module components/PageComponent
 * @vue-data {object} pagedata - id of displayed page or null
 * @vue-data {OpenSeadragon.TiledImage} tidata - tiled image object of displayed page
 * @vue-data {Boolean} topsource - image is displayed in front of all
 * @vue-prop {String} sourceId - id of source object
 * @vue-prop {Object} page - page data object
 * @vue-prop {OpenSeadragon.Rect} pos - position (x,y) of page (viewport coordinate)
 * @vue-prop {String} divid - id of overlay element
 * @vue-prop {Boolean} active - source is selected
 * @vue-computed {OpenSeadragon.Viewer} viewer
 * @vue-computed {OpenSeadragon.TiledImage} tiledimage
 * @vue-computed {OpenSeadragon.Overlay} overlay
 * @vue-computed {String} pageID - id of displayed page or null
 * @vue-computed {Boolean} isActive - if pagedata ist valid | recto or verso page is available
 * @vue-computed {Number} scaleFactor - dimension.width / pixels.width
 * @vue-computed {Number} width - scaled width for OpenSeadragon
 * @vue-computed {Number} height - scaled height for OpenSeadragon
 * @vue-computed {Object[]} zones - array of measure zones for displayed page
 * @vue-computed {Boolean} displayMeasures - display all measure numbers (checkbox)
 * @vue-computed {Boolean} showDetail - display all measure rects (if scale>=1.2)
 * @vue-computed {String} measureRange - range of measure numbers for full page
 * @vue-computed {Object} completeStyle - style for overlay if not `showDetail`
 * @vue-computed {Object} fullRect - rectangle enclosing all zones
 */
export default {
  components: { ZoneComponent },
  name: 'PageComponent',
  props: {
    sourceId: {
      type: String,
      required: true
    },
    page: {
      type: Object,
      required: false
    },
    pos: {
      type: Object,
      required: true
    },
    divid: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      pgdata: this.page?.id,
      tidata: null,
      topsource: false
    }
  },
  mounted () {
    this.updateTI()
  },
  updated () {
    // console.log('updated ' + this.page ? this.page.id : '[null]')
    this.updateTI()
    if (this.page && this.page.measures_uri) {
      this.$store.dispatch(actions.loadZones, this.page)
    }
  },
  watch: {
    page () {
      // console.log('change page', this.page, this.page?.measures_uri)
      this.updateTI()
      if (this.page && this.page.measures_uri) {
        this.$store.dispatch(actions.loadZones, this.page)
      }
    },
    pos () {
      // console.log(this.divid + ' ' + this.x + ', ' + this.y)
      this.updatePosition()
    },
    active () {
      const ci = this.viewer.world.getItemCount()
      if (this.tiledimage && !this.topsource && this.active) {
        this.viewer.world.setItemIndex(this.tiledimage, ci - 1)
      }
      this.topsource = this.active
    },
    activeComplaintId () {
      const newVal = this.$store.getters.activeComplaintId
      // console.log('CALLING OUT FOR ' + newVal)
      this.highlightMonitumShapes(newVal)
    }
  },
  beforeDestroy () {
    // console.log('bye bye Page')
    if (this.tiledimage) {
      if (this.viewer) {
        this.viewer.world.setItemIndex(this.tiledimage, 0)
      }
      this.tiledimage.setOpacity(0)
      this.tiledimage.destroy()
    }
    if (this.overlay) {
      this.overlay.destroy()
    }
  },
  computed: {
    ...mapGetters([getters.viewer, getters.scale, getters.displayMeasures]),
    tiledimage: {
      get () {
        return this.tidata
      },
      set (ti) {
        if (this.tidata) {
          // remove previous image
          this.viewer.world.setItemIndex(this.tidata, 0)
          this.tidata.setOpacity(0)
          this.tidata.destroy()
        }
        this.tidata = ti
        if (this.tidata) {
          if (this.overlay) {
            this.overlay.update(this.pos, OpenSeadragon.TOP_CENTER)
          } else {
            this.viewer.addOverlay({
              element: this.$el,
              location: this.pos
            }, this.pos, OpenSeadragon.TOP_CENTER)
          }
        }
      }
    },
    style () {
      const zoom = this.viewer.viewport.getZoom(true)
      const scale = this.viewer.viewport._containerInnerSize.x * zoom
      const fs = Math.max(7, 7 * scale)
      // console.log(fs)
      return {
        'font-size': fs + 'px'
      }
    },
    showDetail () {
      // console.log(this.scale, this.scale > 1.2)
      return this.scale > 1.2
    },
    // overlay () {
    //   return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    // },
    pageID () {
      return (this.page ? this.page.id : null)
    },
    isActive () {
      // make it a boolean
      if (this.page) {
        return true
      }
      return false
    },
    scaleFactor () {
      return (this.isActive)
        ? parseInt(this.page.dimensions.width) / parseInt(this.page.pixels.width)
        : 0
    },
    width () {
      return this.isActive ? this.page.dimensions.width : 0
    },
    height () {
      return this.isActive ? this.page.dimensions.height : 0
    },
    zones () {
      // console.log('page zones ...')
      if (this.page) {
        return this.page.measures
      }
      return []
    },
    measureRange () {
      if (this.zones.length === 0) {
        return '---'
      }
      const mrange = { min: undefined, max: undefined }
      for (var z = 0; z < this.zones.length; z++) {
        const zone = this.zones[z]
        if (zone.measure && zone.measure.length > 0) {
          if (!mrange.min || +zone.measure[0] < mrange.min) {
            mrange.min = zone.measure
          }
          if (!mrange.max || +zone.measure[0] > mrange.max) {
            mrange.max = zone.measure
          }
        }
      }
      return mrange.min + '-' + mrange.max
    },
    completeStyle () {
      const rect = this.fullRect
      const fact = 100 * this.scaleFactor
      // console.log(this.displayMeasures, rect)
      const style = (this.displayMeasures && rect) ? {
        position: 'absolute',
        left: (fact * rect.x / this.width) + '%',
        top: (fact * rect.y / this.height) + '%',
        width: (fact * rect.width / this.width) + '%',
        height: (fact * rect.height / this.height) + '%',
        outline: '1px solid rgba(0,0,255,.5)'
      } : {
        display: 'none'
      }
      // console.log(rect, style)
      return style
    },
    fullRect () {
      if (this.zones.length === 0) {
        return null
      }
      const minPos = {}
      const maxPos = {}

      for (const zone of this.zones) {
        if (!minPos.x || zone.x < minPos.x) {
          minPos.x = zone.x
        }
        if (!minPos.y || zone.y < minPos.y) {
          minPos.y = zone.y
        }
        if (!maxPos.x || (zone.x + zone.width) > maxPos.x) {
          maxPos.x = zone.x + zone.width
        }
        if (!maxPos.y || (zone.y + zone.height) > maxPos.y) {
          maxPos.y = zone.y + zone.height
        }
      }

      const rect = { x: minPos.x, y: minPos.y, width: (maxPos.x - minPos.x), height: (maxPos.y - minPos.y) }
      // console.log(rect)
      return rect
    },
    svgShapeUrl () {
      const svgurl = this.page?.svg_shapes
      console.log(svgurl)
      return svgurl
    },
    activeComplaintId () {
      return this.$store.getters.activeComplaintId
    }
  },
  methods: {
    /**
     * reposition tiled image and overlay
     */
    updatePosition () {
      // console.log('update position', this.pos)
      const overlay = this.viewer ? this.viewer.getOverlayById(this.divid) : null
      if (overlay) {
        overlay.update(this.pos)
      } else {
      //   console.debug('no overlay!', this.divid)
        if (this.page?.id) {
          setTimeout(1000, this.updatePosition)
        }
      }
      if (this.tiledimage) {
        this.tiledimage.setPosition(this.pos, true)
      }
    },
    /**
     * load new tiled image on start or page flip
     */
    updateTI () {
      // console.log('update TI ' + (this.pgdata !== this.pageID))
      this.updatePosition()
      if (!this.tiledimage || this.pgdata !== this.pageID) {
        /* console.log('\n\nopening new page ' + this.pgdata)
        console.log('this.tiledimage:')
        console.log(this.tiledimage)
        console.log('this.isActive: ' + this.isActive)
        console.log('.\n\n') */
        // new page
        if (this.isActive) {
          // refresh tiled image
          const page = this.page
          const x = this.pos.x
          const y = this.pos.y
          const tisrc = {
            tileSource: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': page.uri,
              profile: 'http://iiif.io/api/image/2/level2.json',
              protocol: 'http://iiif.io/api/image',
              width: page.pixels.width,
              height: page.pixels.height
            },
            success: (e) => {
              // when the tiled image is loaded (on success), a previous image is removed
              this.tiledimage = e.item
              const svgContainer = this.$el.querySelector('.svg-shapes')
              try {
                svgContainer.removeEventListener('click', this.clickShapes)
                svgContainer.innerHTML = ''
                console.log('got rid of old stuff')
              } catch (err) {
                console.log('cannot remove svg')
              }

              if (this.svgShapeUrl && svgContainer) {
                // console.log('got in')
                // svgContainer.innerHTML = '<img width="100%" src="' + page.svg_shapes + '" />'

                const callback = ({ data }) => {
                  // console.log(this.svgShapeUrl)
                  const parser = new DOMParser()
                  const serializer = new XMLSerializer()
                  const svg = parser.parseFromString(data, 'image/svg+xml')
                  const svgroot = svg.documentElement
                  svgroot.setAttribute('width', '100%')
                  svgroot.setAttribute('height', '100%')
                  // const shapes = svgroot.querySelectorAll('path')
                  svgContainer.innerHTML = serializer.serializeToString(svg)
                  svgContainer.addEventListener('click', this.clickShapes)

                  const activeComplaintId = this.$store.getters.activeComplaintId
                  if (activeComplaintId) {
                    // console.log('highlight', activeComplaintId)
                    this.highlightMonitumShapes(activeComplaintId)
                  }
                }
                const url = this.svgShapeUrl
                // if (!this.page.svgRequested) {
                axios.get(url).then(callback)
                // } else {    console.log('skipping second loading of SVG shapes')
                // }
                this.page.svgRequested = true
              }
            },
            x,
            y,
            width: page.dimensions.width// ,
            // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
            // fitBoundsPlacement: placement,
            // degrees: source.rotation / 5
          }
          // console.log(tisrc)
          this.viewer.addTiledImage(tisrc)

          // console.log(svgContainer)
          // console.log('--CALLING ELVIS ' + this.sourceId.split('/').slice(-1)[0] + ' – ' + typeof this.svgShapeUrl + ' – ' + typeof svgContainer)
        } else {
          this.tiledimage = null
        }
      }
      this.pgdata = this.page ? this.page.id : null
      if (!this.page) {
        this.tiledimage = null
      }
    },
    /**
     * The function called when the user clicks on an SVG shape.
     *
     * TODO: We need to preserve a reference to all listeners and
     * need to remove them when switching pages
     */
    clickShapes (e) {
      if (e.target.localName === 'path') {
        const path = e.target
        const g = path.parentElement

        const attName = g.attributes[0].name
        const partOfMonitum = attName.startsWith('data-mon-')
        const meiId = path.getAttribute('data-mei')

        if (partOfMonitum) {
          const monitumId = attName.substring(9)

          // console.log('clicked on shape ' + path.id + ', which belongs to MEI ' + meiId + ' and is part of monitum ' + monitumId)

          this.highlightMonitumShapes(monitumId)
          /* document.querySelectorAll('svg g[' + attName + '] path').forEach((p) => {
            p.style.fill = 'green'
          }) */
          /* g.querySelectorAll('path').forEach((p) => {
            p.style.fill = 'blue'
          }) */
          const oldId = this.$store.getters.activeComplaintId
          if (oldId === null) {
            this.$store.dispatch(actions.activateComplaint, monitumId)
          } else if (oldId !== monitumId && !oldId.endsWith('/' + monitumId + '.json')) {
            this.$store.dispatch(actions.activateComplaint, monitumId)
          }
        } else {
          console.log('clicked on ' + path.id + ', which is not part of a monitum ')
        }

        if (meiId !== '') {
          const firstItem = meiId.split(' ')[0]
          this.$store.dispatch(actions.setCurrentItem, firstItem)
        }
      }
    },
    highlightMonitumShapes (id) {
      const prefix = 'data-mon-'

      document.querySelectorAll('svg g.activeComplaint').forEach((g) => {
        g.classList.remove('activeComplaint')
        g.removeChild(g.firstChild)
      })

      if (typeof id === 'string') {
        const attName = id.endsWith('.json') ? prefix + tb.atId(id) : prefix + id
        document.querySelectorAll('svg g[' + attName + ']').forEach((g) => {
          const bbox = g.getBBox()
          const svgns = 'http://www.w3.org/2000/svg'
          const rect = document.createElementNS(svgns, 'rect')
          rect.setAttributeNS(null, 'x', bbox.x)
          rect.setAttributeNS(null, 'y', bbox.y)
          rect.setAttributeNS(null, 'height', bbox.height)
          rect.setAttributeNS(null, 'width', bbox.width)
          rect.classList.add('bg')
          g.insertBefore(rect, g.firstChild)

          g.classList.add('activeComplaint')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-component {
  position: absolute;
  // border: 1px solid green;
}
.hideovl {
  display: none
}
.range-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.range-info {
  display: inline-block;
  background-color: rgba(255, 255, 255, .5);
  padding: 3pt;
}
.svg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // border: 1px solid red;
}
.svg-shapes img {
  width: 100%;
  height: auto;
}
</style>
