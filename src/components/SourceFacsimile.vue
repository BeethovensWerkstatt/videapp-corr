<template>
  <div
    class="sourceBack"
    v-bind:class="{ active: isActive }"
    :id="this.divid"
    :title="label"
  >
    <btn-group>
      <btn
        @click="prevPage"
        :disabled="!hasPrev">
      ◄
      </btn>
      <btn id="draghandle">
        ❂
      </btn>
      <btn @click="openSourceInfo">
        ℹ
      </btn>
      <btn
        @click="nextPage"
        :disabled="!hasNext"
      >
      ►
      </btn>
    </btn-group>
  </div>
</template>

<script>
import OpenSeadragon from 'openseadragon'

/**
 * Source components are created dynamically. See {@tutorial vue-components-programmatically}.
 * If a source is selected it may be accessed globally. See {@link module:SourceInfo}.
 *
 * @vue-data {Object} position - position of source on desktop (x,y)
 * @vue-data {Number} pagenr - index of displayed page-pair
 * @vue-prop {Object} source - source object
 * @vue-prop {OpenSeadragonComponent} OSD - OpenSeaDragon component
 * @vue-prop {Number} index - index of this source
 * @vue-prop {Number} [defaultPage=0] - default page pair
 * @vue-computed {String} divid - id of the div for the source label
 * @vue-computed {Number} width - width of control div
 * @vue-computed {Number} height - height of control div
 * @vue-computed {String} label - label of this source
 * @vue-computed {OpenSeadragon} viewer - OpenSeadragon Viewer
 * @vue-computed {Boolean} hasNext - next page pair available
 * @vue-computed {Boolean} hasPrev - previous page pair available
 * @vue-computed {String} left_label - label of left (verso) page
 * @vue-computed {String} right_label - label of right (recto) page
 * @vue-computed {Boolean} isActive - true if this is the selected source
 * @vue-computed {Object} labelStyle - adjusted font-size by zoom-factor
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
      // pagetiles: [],
      ti_recto: null,
      ti_verso: null,
      moving: null,
      tracker: null
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
    this.addMark(this.source.position.x, this.source.position.y)
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

    const dh = this.$el.querySelector('#draghandle')
    console.log(this.width + ' x ' + this.height)
    this.tracker = new OpenSeadragon.MouseTracker({
      element: dh,
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler
    })

    this.openPage(this.pagenr)
  },
  computed: {
    divid () {
      return this.source.id + '_back'
    },
    width () {
      return this.$el.clientWidth
    },
    height () {
      return this.$el.clientHeight
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
    overlay () {
      return this.viewer.getOverlayById(this.divid)
    },
    isActive () {
      return this.OSD.$store.state.activeSourceFacs === this
    },
    labelStyle () {
      return { fontSize: (100000 * this.OSD.viewer.viewport.getZoom()) + '%' }
    }
  },
  methods: {
    /**
     * open previous page pair
     */
    nextPage () {
      const p = this.pagenr + 1
      this.openPage(p)
    },
    /**
     * open next page pair
     */
    prevPage () {
      const p = this.pagenr - 1
      this.openPage(p)
    },
    /**
     * open page pair of index <i>p</i>
     *
     * @param p - index of page pair
     */
    openPage (p) {
      // console.log('open page ' + p)
      if (p >= this.source.pages.length) p = this.source.pages.length - 1
      if (p < 0) p = 0

      this.pagenr = p

      const leftPage = this.source.pages[p].v
      const rightPage = this.source.pages[p].r

      if (leftPage !== null) {
        this.addPage(leftPage, rightPage === null)
      } else {
        if (this.ti_verso) {
          this.ti_verso.setOpacity(0)
          this.ti_verso.destroy()
          this.ti_verso = null
        }
      }
      if (rightPage !== null) {
        this.addPage(rightPage, leftPage === null)
      } else {
        if (this.ti_recto) {
          this.ti_recto.setOpacity(0)
          this.ti_recto.destroy()
          this.ti_recto = null
        }
      }
      const ovl = this.overlay
      if (ovl) {
        console.log(ovl)
        ovl.destroy()
      }
      console.log(this.width)
      const x = this.position.x - (this.width / 2)
      const y = this.position.y + (this.source.maxDimensions.height / 2)
      this.viewer.addOverlay(this.$el,
        new OpenSeadragon.Point(x, y),
        OpenSeadragon.TOP_CENTER)
    },
    /**
     * calculate X for page
     *
     * @param {object} page - page object
     * @param {boolean} single - is single page
     */
    getPageX (page, single = false) {
      if (single) {
        return this.position.x - (this.source.maxDimensions.width / 2)
      }
      return page.place === 'verso'
        ? this.position.x - (this.source.maxDimensions.width / 2)
        : this.position.x // + (this.source.maxDimensions.width / 4)
    },
    /**
     * calculate Y for page
     *
     * @param {object} page - page object
     * @param {boolean} single - is single page
     */
    getPageY (page) {
      return this.position.y - (this.source.maxDimensions.height / 2)
    },
    /**
     * [WIP] *doesn't work right now*
     * Move this SourceFacsimile to a new position
     */
    moveTo (tox, toy) {
      console.log(tox + ' - ' + toy)
      console.log(this.ti_recto)
      console.log(this.ti_verso)

      this.position.x = tox
      this.position.y = toy
      this.openPage(this.pagenr)
      /*
      if (this.ti_verso) {
        const x = tox - (this.source.maxDimensions.width / 4)
        const y = toy - (this.source.maxDimensions.height / 2)
        this.ti_verso.setPosition(x, y)
      }
      if (this.ti_recto) {
        const x = tox + (this.source.maxDimensions.width / 4)
        const y = toy - (this.source.maxDimensions.height / 2)
        this.position.x = x
        this.position.y = y
        this.ti_recto.setPosition(x, y)
      }
      */
    },
    /**
     * create TiledImage for verso and rector page.
     *
     * @param {Object} page - parameters of page: width, height, uri
     */
    addPage (page, single = false) {
      // const scaleFactor = parseInt(page.dimensions.width) / parseInt(page.pixels.width)
      // console.log(scaleFactor)

      const x = this.getPageX(page, single)
      const y = this.getPageY(page)

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
            console.log(e.item)
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
      this.addMark(x, y)
    },
    /**
     * set this source selected
     *
     * @param {Object} e - event object
     */
    openSourceInfo (e) {
      e.preventDefault()
      this.OSD.$store.commit('ACTIVATE_SOURCE', this)
    },
    /**
     * handle drag and drop with the drag handler
     */
    dragHandler (e) {
      if (!this.moving) {
        this.moving = { ...this.position }
      }
      this.moving.x += e.delta.x
      this.moving.y += e.delta.y
      // this.moveTo(this.moving.x, this.moving.y)
    },
    /**
     * handle drag and drop with the drag handler
     */
    dragEndHandler (e) {
      this.moveTo(
        this.position.x + e.position.x,
        this.position.y + e.position.y)
      this.moving = null
      this.openPage(this.pagenr)
    },
    /**
     * **for debugging**
     * add red 'X' at position (x, y)
     */
    addMark (x, y) {
      const mark = document.createElement('div')
      mark.setAttribute('style', 'font-weight: bold; color: red;')
      mark.innerHTML = 'X'
      this.viewer.addOverlay(mark,
        new OpenSeadragon.Point(x, y),
        { placement: OpenSeadragon.Placement.TOP_CENTER })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sourceBack {
  display: none;
}
.sourceBack:hover {
  display: absolute;
}

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
