<template>
  <div
    class="page-component"
    :id="divid"
    :class="{ hideovl: !tiledimage }"
  >
    <div v-if="showDetail">
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
      <span class="range-info">{{ measureRange }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OpenSeadragon from 'openseadragon'
import ZoneComponent from '@/components/ZoneComponent.vue'
import { actions } from '@/store/names'

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
      pgdata: this.page ? this.page.id : null,
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
      // console.log('change page')
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
    scale () {
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
    ...mapGetters(['viewer', 'scale', 'displayMeasures']),
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
    showDetail () {
      return this.scale > 1.2
    },
    overlay () {
      return this.viewer ? this.viewer.getOverlayById(this.divid) : null
    },
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
      if (this.page) {
        return this.page.measures
      }
      return []
    },
    measureRange () {
      if (this.zones.length === 0) {
        return '---'
      }
      const mrange = { min: this.zones[0].measure, max: this.zones[0].measure }
      for (var z = 0; z < this.zones.length; z++) {
        const zone = this.zones[z]
        if (!mrange.min || +zone.measure < mrange.min) {
          mrange.min = zone.measure
        }
        if (!mrange.max || +zone.measure > mrange.max) {
          mrange.max = zone.measure
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
    }
  },
  methods: {
    /**
     * reposition tiled image and overlay
     */
    updatePosition () {
      if (this.overlay) {
        this.overlay.update(this.pos)
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
      if (!this.tiledimage || this.pgdata !== this.pageID) {
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
            },
            x,
            y,
            width: page.dimensions.width// ,
            // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
            // fitBoundsPlacement: placement,
            // degrees: source.rotation / 5
          }
          this.viewer.addTiledImage(tisrc)
        } else {
          this.tiledimage = null
        }
      }
      this.pgdata = this.page ? this.page.id : null
      if (!this.page) {
        this.tiledimage = null
      }
    }
  }
}
</script>

<style scoped>
.page-component {
  position: absolute;
  border: 1px solid green;
}
.hideovl {
  display: none
}
.range-info {
  background-color: rgba(255, 255, 255, .5);
  padding: 3pt;
}
</style>
