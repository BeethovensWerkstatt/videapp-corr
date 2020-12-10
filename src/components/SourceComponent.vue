<template>
  <div
    class="sourceBack"
    :class="{ active: isActive }"
    :id="this.divid"
    :title="label"
    @resize="resize"
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
import Vue from 'vue'
import OpenSeadragon from 'openseadragon'
import SourceOverlay from '@/components/SourceOverlay'
import OverlayContainer from '@/mixins'

const SourceOverlayVue = Vue.extend(SourceOverlay)

/**
 * Source components are created dynamically. See {@tutorial vue-components-programmatically}.
 * If a source is selected it may be accessed globally. See {@link module:SourceInfo}.
 *
 * @vue-mixin {mixin.OverlayContainer}
 * @vue-data {Object} position - position of source on desktop (x,y)
 * @vue-data {Number} pagenr - index of displayed page-pair
 * @vue-prop {Object} source - source object
 * @vue-prop {DesktopComponent} desktop - desktop component
 * @vue-prop {Number} index - index of this source
 * @vue-prop {Number} [defaultPage=0] - default page pair
 * @vue-computed {String} divid - id of the div for the source label
 * @vue-computed {String} label - label of this source
 * @vue-computed {OpenSeadragon} viewer - OpenSeadragon Viewer
 * @vue-computed {Boolean} hasNext - next page pair available
 * @vue-computed {Boolean} hasPrev - previous page pair available
 * @vue-computed {String} left_label - label of left (verso) page
 * @vue-computed {String} right_label - label of right (recto) page
 * @vue-computed {Boolean} isActive - true if this is the selected source
 */
export default {
  name: 'SourceComponent',
  mixins: [OverlayContainer],
  data: function () {
    // console.log('source-component: ' + this.sourceId)
    const source = this.desktop.$store.getters.getSourceById(this.sourceId)
    return {
      position: {
        x: source.position.x,
        y: source.position.y
      },
      pagenr: this.defaultPage,
      ti_recto: null,
      ti_verso: null,
      moving: null,
      tracker: null,
      overlays: []
    }
  },
  props: {
    sourceId: {
      type: String,
      required: true
    },
    desktop: {
      required: true
    },
    defaultPage: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    // link this source component with th source object
    this.source.component = this

    this.addMark(this.source.position.x, this.source.position.y, '')

    const dh = this.$el.querySelector('#draghandle')
    this.tracker = new OpenSeadragon.MouseTracker({
      element: dh,
      clickHandler: () => {
        this.selectSource()
      },
      dragHandler: this.dragHandler,
      dragEndHandler: this.dragEndHandler
    })

    this.openPage(this.pagenr)

    this.viewer.addOverlay(this.$el, this.getDashPos(), OpenSeadragon.TOP_CENTER)
  },
  computed: {
    '$store' () {
      return this.desktop.$store
    },
    viewer () {
      return this.$store.getters.viewer
    },
    divid () {
      return this.source.id + '_back'
    },
    source () {
      const source = this.$store.getters.getSourceById(this.sourceId)
      if (source) {
        return source
      }
      // return fake source object
      return {
        pages: [{ v: null, r: null }]
      }
    },
    label () {
      return this.source.label
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
      return this.desktop.$store.getters.activeSourceID === this.sourceId
    },
    pagetiles () {
      return this.source.pages.map(page => {
        // verso / recto ??
        return {
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': page.uri,
          profile: 'http://iiif.io/api/image/2/level2.json',
          protocol: 'http://iiif.io/api/image',
          width: page.pixels.width,
          height: page.pixels.height
        }
      })
    }
  },
  methods: {
    getSize () {
      const w = this.$el ? this.$el.clientWidth : 200
      const h = this.$el ? this.$el.clientHeight : 10
      const size = new OpenSeadragon.Point(w, h)
      return this.viewer.viewport.deltaPointsFromPixels(size)
    },
    /**
     * get width of control
     *
     * @returns {number} width of control panel
     */
    getWidth () {
      return this.getSize().x
    },
    /**
     * get height of control in OpenSeadragon coordinates
     *
     * @returns {number} height of control panel
     */
    getHeight () {
      return this.getSize().y
    },
    /**
     * open next page pair
     */
    nextPage () {
      const p = this.pagenr + 1
      this.openPage(p)
    },
    /**
     * open previous page pair
     */
    prevPage () {
      const p = this.pagenr - 1
      this.openPage(p)
    },
    /**
     * is current page single?
     */
    isSinglePage () {
      if (!this.source.pages[this.pagenr].v && !this.source.pages[this.pagenr].r) {
        console.log('no displayed page???')
      }
      return (this.source.pages[this.pagenr].v === null &&
              this.source.pages[this.pagenr].r !== null) ||
             (this.source.pages[this.pagenr].v !== null &&
              this.source.pages[this.pagenr].r === null)
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
    },
    /**
     * get X coordinate of control panel
     *
     * @returns {number} X coordinate
     */
    getDashX () {
      return this.position.x - (this.getWidth() / 2)
    },
    /**
     * get Y coordinate of control panel
     *
     * @returns {number} Y coordinate
     */
    getDashY () {
      return this.position.y + (this.source.maxDimensions.height / 2)
    },
    /**
     * get coordinate point of control panel
     *
     * @returns {OpenSeadragon.Point} coordinate of left upper corner
     */
    getDashPos () {
      // console.log(this.getWidth())
      return new OpenSeadragon.Point(this.getDashX(), this.getDashY())
    },
    /**
     * update dash coordinates to current scale
     */
    updateDashPos () {
      const p = this.getDashPos()
      if (this.overlay) {
        this.overlay.update(p, OpenSeadragon.TOP_CENTER)
      }
    },
    /**
     * calculate X for page
     *
     * @param {object} page - page object
     * @param {boolean} single - is single page
     * @returns {number} X coordinate of tiled source images
     */
    getPageX (page) {
      // console.log(this.sourceId + ': ' + page.place + ' single: ' + this.isSinglePage())
      if (this.isSinglePage()) {
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
     * @returns {number} Y coordinate of tiled source images
     */
    getPageY (page) {
      return this.position.y - (this.source.maxDimensions.height / 2)
    },
    /**
     * Move this SourceComponent to a new position
     *
     * @param {number} tox - X coordinate
     * @param {number} toy - Y coordinate
     */
    moveTo (tox, toy, end = false) {
      // console.log(tox + ' - ' + toy)
      // console.log(this.ti_recto)
      // console.log(this.ti_verso)

      this.position.x = tox
      this.position.y = toy

      this.updateDashPos()

      const pageXr = this.getPageX({ place: 'recto' })
      const pageYr = this.getPageY({ place: 'recto' })
      const pageXv = this.getPageX({ place: 'verso' })
      const pageYv = this.getPageY({ place: 'verso' })

      var ovl
      // move debug markers ...
      const tenp = this.viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(10, 10)).x
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_')
      if (ovl) {
        ovl.update(
          new OpenSeadragon.Point(this.position.x - tenp, this.position.y - tenp),
          OpenSeadragon.TOP_CENTER)
      }
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_verso')
      if (ovl) {
        const pos = new OpenSeadragon.Point(
          pageXv - tenp,
          pageYv - tenp)
        ovl.update(pos, OpenSeadragon.TOP_CENTER)
      }
      ovl = this.viewer.getOverlayById('mark_' + this.divid + '_recto')
      if (ovl) {
        const pos = new OpenSeadragon.Point(
          pageXr - tenp,
          pageYr - tenp)
        ovl.update(pos, OpenSeadragon.TOP_CENTER)
      }
      // ... move debug markers end

      if (this.ti_verso) {
        this.ti_verso.setPosition(new OpenSeadragon.Point(pageXv, pageYv), true)
      }
      if (this.ti_recto) {
        this.ti_recto.setPosition(new OpenSeadragon.Point(pageXr, pageYr), true)
      }
    },
    /**
     * create TiledImage for verso and recto page.
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
      const tenp = this.viewer.viewport.deltaPointsFromPixels(new OpenSeadragon.Point(10, 10)).x
      this.addMark(x - tenp, y - tenp, page.place)
      this.updateDashPos()

      const srcovl = new SourceOverlayVue({
        propsData: {
          SF: this,
          source: this.source,
          page: page
        }
      })
      srcovl.$mount()
      // const htmlovl = this.viewer.htmlOverlay()
      // htmlovl.element().appendChild(srcovl.$el)
      // const scaleFactor = parseInt(page.dimensions.width) / parseInt(page.pixels.width)
      // this.viewer.addOverlay(srcovl.$el, new OpenSeadragon.Rect(x, y, page.pixels.width * scaleFactor, page.pixels.height * scaleFactor))
    },
    /**
     * place source on top of the stack
     */
    placeOnTop () {
      const ci = this.viewer.world.getItemCount()
      if (this.ti_verso) {
        this.viewer.world.setItemIndex(this.ti_verso, ci - 1)
      }
      if (this.ti_recto) {
        this.viewer.world.setItemIndex(this.ti_recto, ci - 1)
      }
    },
    /**
     * select this source
     *
     * @param {Object} e - event object
     */
    selectSource (e) {
      if (e) {
        e.preventDefault()
      }
      this.desktop.$store.commit('ACTIVATE_SOURCE', this)
      this.placeOnTop()
    },
    /**
     * handle drag and drop with the drag handler
     *
     * @param {Object} e - event object
     */
    dragHandler (e) {
      if (!this.moving) {
        this.moving = { ...this.position }
        this.selectSource()
      }
      const delta = this.viewer.viewport.deltaPointsFromPixels(e.delta)
      this.moveTo(this.position.x + delta.x, this.position.y + delta.y)
    },
    /**
     * handle drag and drop with the drag handler
     *
     * @param {Object} e - event object
     */
    dragEndHandler (e) {
      // const delta = this.viewer.viewport.deltaPointsFromPixels(e.position)
      // this.moveTo(
      //  this.position.x + delta.x,
      //  this.position.y + delta.y)
      this.moving = null
    },
    /**
     * get current zoom scale
     *
     * @returns {number} zoom factor
     */
    getScale () {
      var zoom = this.viewer.viewport.getZoom(true)
      return this.viewer.viewport._containerInnerSize.x * zoom
    },
    /**
     * get CSS transformation string
     *
     * @returns {string} 'scale(*scale*) rotate(*rotation*)'
     */
    getTransform () {
      var rotation = this.viewer.viewport.getRotation()
      return 'scale(' + this.getScale() + ') rotate(' + rotation + ')'
    },
    /**
     * *not used*
     * calculate styles for control panel
     *
     * @returns {object} position and scale
     */
    styles () {
      var p = this.viewer.viewport.pixelFromPoint(this.getDashPos(), true)

      return {
        left: p.x + 'px',
        top: p.y + 'px',
        transform: this.getTransform()
      }
    },
    /**
     * *not used*
     * process resize events
     */
    resize (e) {
      console.log(e)
      this.updateDashPos()
    },
    /**
     * **for debugging**
     * add red 'X' at position (x, y)
     */
    addMark (x, y, tag) {
      const id = 'mark_' + this.divid + '_' + tag
      const mark = document.createElement('div')
      mark.setAttribute('id', id)
      mark.setAttribute('style', 'font-weight: bold; color: red; width: 20px; text-align: center;')
      mark.innerHTML = 'X'
      if (this.overlay) {
        this.overlay.update(new OpenSeadragon.Point(x - 10, y), OpenSeadragon.Placement.TOP_CENTER)
      } else {
        this.viewer.addOverlay(mark,
          new OpenSeadragon.Point(x - 10, y),
          { placement: OpenSeadragon.Placement.TOP_CENTER })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.sourceBack {
  background-color: rgba($color: #ffffff, $alpha: 0.5);
  width: 110px;
  text-align: center;
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
  background-color: rgba($color: #ffffff, $alpha: 0.8);
}
</style>
