<template>
  <div class="sourceBack" :id="this.divid" @click="openSourceInfo">
    <label>{{ this.label }}</label>
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
      }
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
    }
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
    }
  },
  mounted () {
    const x = this.source.position.x
    const y = this.source.position.y + (this.source.maxDimensions.height / 2)

    this.openPage(0)
    this.viewer.addOverlay(this.$el, new OpenSeadragon.Point(x, y), OpenSeadragon.TOP_CENTER)
  },
  methods: {
    /**
     * @param p - open page pair <i>p</i>
     */
    openPage (p) {
      // console.log('open page ' + p)

      const leftPage = this.source.pages[p].v
      const rightPage = this.source.pages[p].r

      if (leftPage !== null) {
        this.addPage(leftPage)
      }
      if (rightPage !== null) {
        this.addPage(rightPage)
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
        x,
        y,
        index: this.index,
        width: page.dimensions.width// ,
        // fitBounds: new OpenSeadragon.Rect(source.position.x, source.position.y, page.dimensions.width, page.dimensions.height),
        // fitBoundsPlacement: placement,
        // degrees: source.rotation / 5
      })
    },
    openSourceInfo (e) {
      e.preventDefault()
      this.OSD.$store.commit('ACTIVATE_SOURCE', this.source)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sourceBack {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  border-radius: 5px;
  margin: 5pt;
  padding: 3pt;
}

.sourceBack:active {
  border: 1px solid blue;
  background-color: rgba($color: #ffff88, $alpha: 1.0);
}

.sourceBack:hover {
  border: 1px solid blue;
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
</style>
