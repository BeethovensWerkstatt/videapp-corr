<template>
  <div class="sourceBack" v-bind:class="{ active: isActive }" :id="this.divid">
    <btn-group>
      <btn @click="prevPage" v-if="hasPrev">◄</btn>
      <btn @click="openSourceInfo" v-bind:style="this.labelStyle">{{ this.label }} ({{ this.pagenr+1 }}/{{ this.source.pages.length }})</btn>
      <btn @click="nextPage" v-if="hasNext">►</btn>
    </btn-group>
  </div>
</template>

<script>
import OpenSeadragon from 'openseadragon'

/**
 * @vue-prop {Object} source - source object
 * @vue-prop {OpenSeadragonComponent} OSD - OpenSeaDragon component
 * @vue-prop {Number} index - index of this source
 * @vue-computed {String} divid - id of the div for the source label
 * @vue-computed {String} label - label of this source
 * @vue-computed {OpenSeadragon} viewer - OpenSeadragon Viewer
 */
export default {
  name: 'SourceFacsimile',
  data: function () {
    return {
      position: {
        x: this.source.position.x,
        y: this.source.position.y
      },
      pagenr: this.defaultPage,
      pagetiles: [],
      ti_recto: null,
      ti_verso: null
    }
  },
  props: {
    source: {
      type: Object,
      default: () => {
        return {
          pages: [{ v: null, r: null }]
        }
      }
    },
    OSD: {
      required: true
    },
    index: {
      type: Number
    },
    defaultPage: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    const x = this.source.position.x
    const y = this.source.position.y + (this.source.maxDimensions.height / 2)

    /*
    this.pagetiles = this.source.pages.map(page => {
      return {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': page.uri,
        profile: 'http://iiif.io/api/image/2/level2.json',
        protocol: 'http://iiif.io/api/image',
        width: page.pixels.width,
        height: page.pixels.height
      }
    })
    */

    this.openPage(this.pagenr)
    this.viewer.addOverlay(this.$el, new OpenSeadragon.Point(x, y), OpenSeadragon.TOP_CENTER)
  },
  computed: {
    divid () {
      return this.source.id + '_back'
    },
    label () {
      return this.source.label
    },
    viewer () {
      return this.OSD.viewer
    },
    hasNext () {
      return this.pagenr < this.source.pages.length - 1
    },
    hasPrev () {
      return this.pagenr > 0
    },
    left_label () {
      if (this.pagenr >= 0 && this.pagenr < this.source.pages.length) {
        if (this.source.pages[this.pagenr].v) {
          return this.source.pages[this.pagenr].v.label
        }
      }
      return '---'
    },
    right_label () {
      if (this.pagenr >= 0 && this.pagenr < this.source.pages.length) {
        if (this.source.pages[this.pagenr].r) {
          return this.source.pages[this.pagenr].r.label
        }
      }
      return '---'
    },
    isActive () {
      return this.OSD.$store.state.activeSourceFacs === this
    },
    labelStyle () {
      return { fontSize: (100 * this.OSD.viewer.getZoom()) + '%' }
    }
  },
  methods: {
    nextPage () {
      const p = this.pagenr + 1
      this.openPage(p)
    },
    prevPage () {
      const p = this.pagenr - 1
      this.openPage(p)
    },
    /**
     * @param p - open page pair <i>p</i>
     */
    openPage (p) {
      // console.log('open page ' + p)
      if (p >= this.source.pages.length) p = this.source.pages.length - 1
      if (p < 0) p = 0

      this.pagenr = p

      const leftPage = this.source.pages[p].v
      const rightPage = this.source.pages[p].r

      if (leftPage !== null) {
        this.addPage(leftPage)
      } else {
        if (this.ti_verso) {
          this.ti_verso.setOpacity(0)
          this.ti_verso.destroy()
          this.ti_verso = null
        }
      }
      if (rightPage !== null) {
        this.addPage(rightPage)
      } else {
        if (this.ti_recto) {
          this.ti_recto.setOpacity(0)
          this.ti_recto.destroy()
          this.ti_recto = null
        }
      }
    },
    addPage (page) {
      // const scaleFactor = parseInt(page.dimensions.width) / parseInt(page.pixels.width)
      // console.log(scaleFactor)

      const x = page.place === 'verso' ? this.source.position.x - (this.source.maxDimensions.width / 4) : this.source.position.x + (this.source.maxDimensions.width / 4)
      const y = this.source.position.y - (this.source.maxDimensions.height / 2)

      this.viewer.addTiledImage({
        tileSource: {
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': page.uri,
          profile: 'http://iiif.io/api/image/2/level2.json',
          protocol: 'http://iiif.io/api/image',
          width: page.pixels.width,
          height: page.pixels.height
        },
        success: (e) => {
          if (page.place === 'verso') {
            if (this.ti_verso) {
              this.ti_verso.setOpacity(0)
              this.ti_verso.destroy()
            }
            this.ti_verso = e.item
          } else {
            if (this.ti_recto) {
              this.ti_recto.setOpacity(0)
              this.ti_recto.destroy()
            }
            this.ti_recto = e.item
          }
        },
        x,
        y,
        width: page.dimensions.width// ,
        // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
        // fitBoundsPlacement: placement,
        // degrees: source.rotation / 5
      })
    },
    openSourceInfo (e) {
      e.preventDefault()
      this.OSD.$store.commit('ACTIVATE_SOURCE', this)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btn {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: 5px;
  margin: 5pt;
  padding: 3pt;
}

.btn:hover {
  border: 1px solid blue;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
.active {
  border: 1px solid green;
  background-color: rgba($color: #ffffff, $alpha: 0.5);
}
</style>
