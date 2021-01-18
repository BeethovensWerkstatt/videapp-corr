<template>
  <div
    class="page-component"
    :id="divid"
    :style="{
      left: x,
      top: y,
      width: width,
      height: height
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
      data: {
        pagadata: null,
        tidata: null
      }
    }
  },
  computed: {
    page: {
      get () {
        return this.pagedata
      },
      set (newpage) {
        this.pagedata = newpage
        // refresh tiled image
        if (this.isActive) {
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
          // console.log(tisrc.tileSource.overlays)
          this.viewer.addTiledImage(tisrc)
        } else {
          this.tiledimage = null
        }
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
      }
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
    }
  }
}
</script>

<style scoped>
.page-component {
  position: absolute;
}
</style>
