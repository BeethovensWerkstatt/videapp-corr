<template>
  <div
    class="page-component"
    :id="divid"
    :style="{
      left: x,
      top: y,
      width: width,
      height: height,
      transform: transform
    }">
    <zone-component
      v-for="zone in page.measures"
      :key="zone.zone"
      :x="scaleFactor * zone.x"
      :y="scaleFactor * zone.y"
      :width="scaleFactor * zone.width"
      :height="scaleFactor * zone.height"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vue'
import OpenSeadragon from 'openseadragon'
import ZoneComponent from './ZoneComponent.vue'
/**
 * Component for one page. Collect all measure-zones
 *
 * @module components/PageComponent
 * @vue-data {object} pagedata - data for displayed page
 * @vue-data {OpenSeadragon.TiledImage} tidata
 * @vue-prop {number} x - horizontal position on desktop
 * @vue-prop {number} y - vertical position on desktop
 * @vue-computed {object} page - data for displayed page
 * @vue-computed {OpenSeadragon.TiledImage} tiledimage
 * @vue-computed {boolean} isActive - if pagedata ist valid
 * @vue-computed {number} scaleFactor - dimension.width / pixels.width
 * @vue-computed {number} width - scaled width for OpenSeadragon
 * @vue-computed {number} height - scaled height for OpenSeadragon
 */
export default {
  components: { ZoneComponent },
  name: 'PageComponent',
  props: {
    pagedata: {
      type: Object,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    divid: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tidata: null
    }
  },
  computed: {
    ...mapGetters(['viewer', 'scale']),
    page: {
      get () {
        return this.pagedata
      },
      set (newpage) {
        this.pagedata = newpage

        if (this.isActive) {
          // refresh tiled image
          const page = this.page
          const x = this.x
          const y = this.y
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
        // refresh overlay?
      }
    },
    tiledimage: {
      get () {
        return this.tidata
      },
      set (ti) {
        if (this.tidata) {
          // remove previous image
          this.tidata.setOpacity(0)
          this.tidata.destroy()
        }
        this.tidata = ti
        if (this.tidata) {
          if (this.overlay) {
            this.overlay.update(this.pos, OpenSeadragon.TOP_LEFT)
          } else {
            this.viewer.addOverlay(this.$el, this.pos, OpenSeadragon.TOP_LEFT)
          }
        } else {
          if (this.overlay) {
            this.overlay.destroy()
          }
        }
      }
    },
    overlay () {
      return this.viewer.getOverlayById(this.divid)
    },
    isActive () {
      return this.pagedata !== null
    },
    scaleFactor () {
      return (this.isActive)
        ? parseInt(this.pagedata.dimensions.width) / parseInt(this.pagedata.pixels.width)
        : 0
    },
    width () {
      return this.isActive ? this.scaleFactor * this.pagedata.pixels.width : 0
    },
    height () {
      return this.isActive ? this.scaleFactor * this.pagedata.pixels.height : 0
    },
    pos () {
      return new OpenSeadragon.Rect(this.x, this.y, this.width, this.height)
    }
  },
  methods: {
    /**
     * resize handler for OpenSeadragon
     */
    resize () {
      var p = this.viewer.viewport.pixelFromPoint(new OpenSeadragon.Point(0, 0), true)
      var zoom = this.viewer.viewport.getZoom(true)
      // source rotation
      var rotation = this.viewer.viewport.getRotation()

      // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
      // ??? do we need width of page?
      var scale = this.viewer.viewport._containerInnerSize.x * zoom

      this.transform =
        'translate(' + p.x + 'px,' + p.y + 'px) ' +
        'scale(' + scale + ') rotate(' + rotation + ')'
    }
  }
}
</script>

<style scoped>
.page-component {
  position: absolute;
}
</style>
